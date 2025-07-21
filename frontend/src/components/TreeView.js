import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./TreeView.css";

export default function TreeView({ treeData }) {
  const svgRef = useRef();
  const rootRef = useRef(null);
  const iRef = useRef(0); // for unique IDs
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!treeData) return;

    iRef.current = 0; // reset id counter

    const margin = { top: 40, right: 120, bottom: 40, left: 120 };
    const width = 1200 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;
    const duration = 750;

    // Clear previous SVG content if any
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background", "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)")
      .style("border-radius", "10px");

    // Optional: add pattern grid background
    const defs = svg.append("defs");
    const pattern = defs
      .append("pattern")
      .attr("id", "grid")
      .attr("width", 20)
      .attr("height", 20)
      .attr("patternUnits", "userSpaceOnUse");
    pattern
      .append("path")
      .attr("d", "M 20 0 L 0 0 0 20")
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.1)")
      .attr("stroke-width", 1);
    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "url(#grid)");

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const treeLayout = d3.tree().size([height, width]);

    const root = d3.hierarchy(treeData);
    root.x0 = height / 2;
    root.y0 = 0;
    rootRef.current = root;

    // Collapse helper
    const collapse = (d) => {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    };

    // Initially collapse all except root's immediate children
    if (root.children) {
      root.children.forEach(collapse);
    }

    function diagonal(s, d) {
      return `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`;
    }

    function update(source) {
      const treeData = treeLayout(rootRef.current);

      const nodes = treeData.descendants();
      const links = treeData.descendants().slice(1);

      // Set fixed y position based on depth for better spacing
      nodes.forEach((d) => {
        d.y = d.depth * 220;
      });

      // ----- Nodes -----
      const node = g.selectAll("g.node").data(nodes, (d) => d.id || (d.id = ++iRef.current));

      // Enter new nodes
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", () => `translate(${source.y0},${source.x0})`)
        .style("cursor", "pointer")
        .on("click", (event, d) => {
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          update(d);
          setSelected(d.data);
        });

      nodeEnter
        .append("circle")
        .attr("r", 1e-6)
        .style("fill", (d) => (d._children ? "#95a5a6" : "#3498db"))
        .style("stroke", "#2c3e50")
        .style("stroke-width", "2px");

      nodeEnter
        .append("text")
        .attr("dy", ".35em")
        .attr("x", (d) => (d.children || d._children ? -20 : 20))
        .attr("text-anchor", (d) => (d.children || d._children ? "end" : "start"))
        .text((d) => d.data.name)
        .style("fill-opacity", 1e-6);

      // Update + enter
      const nodeUpdate = nodeEnter.merge(node);

      nodeUpdate
        .transition()
        .duration(duration)
        .attr("transform", (d) => `translate(${d.y},${d.x})`);

      nodeUpdate
        .select("circle")
        .attr("r", 8)
        .style("fill", (d) => (d._children ? "#95a5a6" : "#3498db"));

      nodeUpdate.select("text").style("fill-opacity", 1);

      // Exit
      const nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", (d) => `translate(${source.y},${source.x})`)
        .remove();

      nodeExit.select("circle").attr("r", 1e-6);
      nodeExit.select("text").style("fill-opacity", 1e-6);

      // ----- Links -----
      const link = g.selectAll("path.link").data(links, (d) => d.id);

      // Enter new links
      const linkEnter = link.enter().insert("path", "g").attr("class", "link").attr("d", (d) => {
        const o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

      // Update + enter
      linkEnter
        .merge(link)
        .transition()
        .duration(duration)
        .attr("d", (d) => diagonal(d, d.parent));

      // Exit links
      link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();

      // Save old positions for transitions
      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);

    // Cleanup on unmount
    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [treeData]);

  // Button handlers for tree control
  const expandAll = () => {
    if (!rootRef.current) return;
    function expand(d) {
      if (d._children) {
        d.children = d._children;
        d._children = null;
      }
      if (d.children) d.children.forEach(expand);
    }
    expand(rootRef.current);
    // Update with new state
    updateTree(rootRef.current);
  };

  const collapseAll = () => {
    if (!rootRef.current) return;
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }
    if (rootRef.current.children) rootRef.current.children.forEach(collapse);
    updateTree(rootRef.current);
  };

  const resetTree = () => {
    if (!rootRef.current) return;
    // Collapse all except root's immediate children
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }
    if (rootRef.current.children) {
      rootRef.current.children.forEach(collapse);
    }
    updateTree(rootRef.current);
    setSelected(null);
  };

  // Because update is inside useEffect, expose an updater function:
  // This uses d3.select(svgRef.current) to update the tree outside useEffect
  function updateTree(source) {
    if (!svgRef.current) return;

    const margin = { top: 40, right: 120, bottom: 40, left: 120 };
    const width = 1200 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;
    const duration = 750;

    const svg = d3.select(svgRef.current);
    const g = svg.select("g");

    const treeLayout = d3.tree().size([height, width]);

    const diagonal = (s, d) =>
      `M ${s.y} ${s.x}
         C ${(s.y + d.y) / 2} ${s.x},
           ${(s.y + d.y) / 2} ${d.x},
           ${d.y} ${d.x}`;

    const treeData = treeLayout(source);

    const nodes = treeData.descendants();
    const links = treeData.descendants().slice(1);

    nodes.forEach((d) => {
      d.y = d.depth * 220;
    });

    // Nodes
    const node = g.selectAll("g.node").data(nodes, (d) => d.id);

    const nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", () => `translate(${source.y0},${source.x0})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        updateTree(d);
        setSelected(d.data);
      });

    nodeEnter
      .append("circle")
      .attr("r", 1e-6)
      .style("fill", (d) => (d._children ? "#95a5a6" : "#3498db"))
      .style("stroke", "#2c3e50")
      .style("stroke-width", "2px");

    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .attr("x", (d) => (d.children || d._children ? -20 : 20))
      .attr("text-anchor", (d) => (d.children || d._children ? "end" : "start"))
      .text((d) => d.data.name)
      .style("fill-opacity", 1e-6);

    const nodeUpdate = nodeEnter.merge(node);

    nodeUpdate
      .transition()
      .duration(duration)
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    nodeUpdate
      .select("circle")
      .attr("r", 8)
      .style("fill", (d) => (d._children ? "#95a5a6" : "#3498db"));

    nodeUpdate.select("text").style("fill-opacity", 1);

    const nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", (d) => `translate(${source.y},${source.x})`)
      .remove();

    nodeExit.select("circle").attr("r", 1e-6);
    nodeExit.select("text").style("fill-opacity", 1e-6);

    // Links
    const link = g.selectAll("path.link").data(links, (d) => d.id);

    const linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", (d) => {
        const o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

    linkEnter
      .merge(link)
      .transition()
      .duration(duration)
      .attr("d", (d) => diagonal(d, d.parent));

    link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", (d) => {
        const o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();

    nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">🚀 MySQL EXPLAIN Visualizer </h1>
      </div>

      <div className="info-panel">
        <p className="info-text">
          <strong>🎯 Interactive Query Analysis:</strong> Explore your MySQL execution plan by clicking nodes to
          expand/collapse.
        </p>
      </div>

      <div className="button-group">
        <button className="btn btn-expand" onClick={expandAll}>
          🌳 Expand All
        </button>
        <button className="btn btn-collapse" onClick={collapseAll}>
          📁 Collapse All
        </button>
        <button className="btn btn-reset" onClick={resetTree}>
          🔄 Reset View
        </button>
      </div>

      <div className="main-content" style={{ display: "flex", gap: "20px" }}>
        <div className="tree-container" style={{ flex: 1 }}>
          <svg ref={svgRef}></svg>
        </div>

        <div className="details-panel" style={{ width: "400px", padding: "10px", border: "1px solid #ccc", borderRadius: "10px", background: "#fff" }}>
          {selected ? (
            <>
              <h3>{selected.name}</h3>
              <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{JSON.stringify(selected.details || selected, null, 2)}</pre>
            </>
          ) : (
            <p>Select a node to see details here</p>
          )}
        </div>
      </div>
    </div>
  );
}
