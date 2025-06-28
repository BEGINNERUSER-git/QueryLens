import { useRef,useEffect ,useState} from "react";
import * as d3 from 'd3'
export default function TreeView({ treeData }) {
  const [selected, setSelected] = useState(null);
  const ref = useRef();

  useEffect(() => {
    if (!treeData) return;

    const format = d3.format(",");
    const nodeSize = 40;
    const root = d3.hierarchy(treeData).eachBefore((i => d => d.index = i++)(0));
    const nodes = root.descendants();
    const maxDepth = d3.max(nodes, d => d.depth);
    const width = (maxDepth + 4) * 200;
    const height = nodes.length * nodeSize + 100;

    const svg = d3.select(ref.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif; background: #fafafa;");

    svg.selectAll("*").remove();

    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(root.links())
      .join("path")
      .attr("d", d => `
        M${d.source.depth * nodeSize * 5},${d.source.index * nodeSize}
        V${d.target.index * nodeSize}
        H${d.target.depth * nodeSize * 5}
      `);

    const node = svg.append("g")
      .selectAll()
      .data(nodes)
      .join("g")
      .attr("transform", d => `translate(${d.depth * nodeSize * 5},${d.index * nodeSize})`)
      .on("click", (event, d) => setSelected(d.data));

    node.append("circle")
      .attr("r", 5)
      .attr("fill", d => d.children ? "#555" : "#999");

    node.append("text")
      .attr("dy", "0.32em")
      .attr("x", d => d.children ? -10 : 10)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name || 'Unnamed');

    node.append("title")
      .text(d => formatDetails(d.data.details));

    function formatDetails(obj, indent = '') {
      if (!obj) return '';
      if (typeof obj !== 'object') return `${obj}`;
      return Object.entries(obj)
        .map(([key, val]) => {
          if (typeof val === 'object' && val !== null) {
            return `${indent}${key}:\n${formatDetails(val, indent + '  ')}`;
          }
          return `${indent}${key}: ${val}`;
        })
        .join('\n');
    }
  }, [treeData]);

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      <svg ref={ref}></svg>
      <div style={{ width: '400px', marginLeft: '20px' }}>
        <h3 className="text-lg font-semibold">Node Details</h3>
        {selected ? (
          <pre className="text-sm text-gray-800 bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(selected.details, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-gray-600">Click a node to see details</p>
        )}
      </div>
    </div>
  );
}
