// frontend/src/components/GraphView.js (continued)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import * as d3 from 'd3';

const GraphContainer = styled.div`
  padding: 1rem;
`;

const GraphCanvas = styled.div`
  width: 100%;
  height: 600px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
`;

const GraphView = () => {
  const [notes, setNotes] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const svgRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/notes');
        setNotes(response.data);
        
        // Transform notes data into graph data
        const nodes = response.data.map(note => ({
          id: note._id,
          title: note.title,
          tags: note.tags || []
        }));
        
        // Create links array
        const links = [];
        response.data.forEach(note => {
          if (note.links && note.links.length > 0) {
            note.links.forEach(targetId => {
              links.push({
                source: note._id,
                target: targetId
              });
            });
          }
        });
        
        setGraphData({ nodes, links });
      } catch (error) {
        console.error('Error fetching notes for graph:', error);
      }
    };
    
    fetchNotes();
  }, []);
  
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      renderGraph();
    }
  }, [graphData]);
  
  const renderGraph = () => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    
    // Create force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));
      
    // Create links
    const link = svg.append("g")
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);
      
    // Create nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", "#0066cc")
      .call(drag(simulation))
      .on("click", (event, d) => {
        navigate(`/note/${d.id}`);
      });
      
    // Add node titles
    node.append("title")
      .text(d => d.title);
      
    // Add node labels
    const text = svg.append("g")
      .selectAll("text")
      .data(graphData.nodes)
      .join("text")
      .attr("dx", 15)
      .attr("dy", 4)
      .text(d => d.title)
      .style("font-size", "10px");
      
    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
        
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
        
      text
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });
    
    // Drag functions
    function drag(simulation) {
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
    }
  };
  
  return (
    <GraphContainer>
      <h1>Knowledge Graph</h1>
      <p>This graph shows connections between your notes. Click on a node to view the note.</p>
      <GraphCanvas ref={svgRef} />
    </GraphContainer>
  );
};

export default GraphView;