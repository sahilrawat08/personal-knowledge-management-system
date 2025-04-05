// frontend/src/components/notes/GraphView.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getGraph } from '../../services/api';
import * as d3 from 'd3';

const GraphContainer = styled.div`
  padding: 20px;
`;

const GraphCanvas = styled.div`
  width: 100%;
  height: 80vh;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Controls = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ZoomControls = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 5px;
`;

const ControlButton = styled.button`
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const Legend = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 12px;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const GraphView = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const svgRef = useRef(null);
  const navigate = useNavigate();
  
  const fetchGraphData = async () => {
    try {
      const response = await getGraph();
      setGraphData({
        nodes: response.data.nodes.map(node => ({
          ...node,
          radius: 8,
          color: getNodeColor(node)
        })),
        links: response.data.edges.map(edge => ({
          source: edge.from,
          target: edge.to,
          value: 1
        }))
      });
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };
  
  useEffect(() => {
    fetchGraphData();
  }, []);
  
  const getNodeColor = (node) => {
    // Color nodes based on their properties
    if (node.tags && node.tags.includes('important')) return '#e91e63';
    if (node.type === 'concept') return '#2196f3';
    return '#4caf50';
  };
  
  const renderGraph = useCallback(() => {
    if (!svgRef.current || !graphData.nodes.length) return;
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    
    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    
    const g = svg.append("g");
    
    // Create force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links)
        .id(d => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody()
        .strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));
    
    // Add links
    const link = g.append("g")
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value));
    
    // Add nodes
    const node = g.append("g")
      .selectAll("g")
      .data(graphData.nodes)
      .join("g")
      .call(drag(simulation))
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        navigate(`/notes/${d.id}`);
      });
    
    // Add circles for nodes
    node.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);
    
    // Add labels
    node.append("text")
      .text(d => d.label)
      .attr("x", d => d.radius + 4)
      .attr("y", "0.31em")
      .style("font-size", "12px")
      .style("pointer-events", "none");
    
    // Add title on hover
    node.append("title")
      .text(d => d.label);
    
    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    // Highlight connected nodes on hover
    node
      .on("mouseover", (event, d) => {
        const connectedNodes = new Set();
        graphData.links.forEach(link => {
          if (link.source.id === d.id) connectedNodes.add(link.target.id);
          if (link.target.id === d.id) connectedNodes.add(link.source.id);
        });
        
        node.style("opacity", n => connectedNodes.has(n.id) || n.id === d.id ? 1 : 0.1);
        link.style("opacity", l => l.source.id === d.id || l.target.id === d.id ? 1 : 0.1);
      })
      .on("mouseout", () => {
        node.style("opacity", 1);
        link.style("opacity", 1);
      });
    
  }, [graphData, navigate]);
  
  useEffect(() => {
    renderGraph();
  }, [graphData, renderGraph]);
  
  // Implement drag behavior
  const drag = (simulation) => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Highlight nodes that match the search term
    const svg = d3.select(svgRef.current);
    const searchTerm = e.target.value.toLowerCase();
    
    svg.selectAll("g")
      .style("opacity", node => {
        const nodeData = node.__data__;
        return nodeData && nodeData.label.toLowerCase().includes(searchTerm) ? 1 : 0.1;
      });
  };
  
  const handleReset = () => {
    setSearchTerm('');
    const svg = d3.select(svgRef.current);
    svg.selectAll("g").style("opacity", 1);
  };
  
  return (
    <GraphContainer>
      <Controls>
        <SearchInput
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <ControlButton onClick={handleReset}>Reset View</ControlButton>
        <ControlButton onClick={fetchGraphData}>Refresh Graph</ControlButton>
      </Controls>
      
      <GraphCanvas ref={svgRef} />
      
      <Legend>
        <h4>Node Types</h4>
        <LegendItem>
          <LegendColor color="#4caf50" />
          <span>Regular Notes</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#2196f3" />
          <span>Concept Notes</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#e91e63" />
          <span>Important Notes</span>
        </LegendItem>
      </Legend>
      
      <ZoomControls>
        <ControlButton onClick={() => d3.select(svgRef.current).transition().call(d3.zoom().scaleBy, 1.2)}>
          Zoom In
        </ControlButton>
        <ControlButton onClick={() => d3.select(svgRef.current).transition().call(d3.zoom().scaleBy, 0.8)}>
          Zoom Out
        </ControlButton>
      </ZoomControls>
    </GraphContainer>
  );
};

export default GraphView;