import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';

const radius = 28;

const isDescendant = (nodes, childId, parentId) => {
  let current = nodes.find((n) => n.id === parentId);
  while (current) {
    if (current.parentId === childId) return true;
    current = nodes.find((n) => n.id === current.parentId);
  }
  return false;
};

export default function MindmapCanvas({ nodes, setNodes, selectedNodeId, setSelectedNodeId, createNode }) {
  const svgRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);

  const visibleNodes = useMemo(() => {
    const collapsed = new Set();
    nodes.forEach((node) => {
      if (node.collapsed) collapsed.add(node.id);
    });

    return nodes.filter((node) => {
      let parent = node.parentId;
      while (parent) {
        if (collapsed.has(parent)) return false;
        parent = nodes.find((n) => n.id === parent)?.parentId;
      }
      return true;
    });
  }, [nodes]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const container = svg.append('g').attr('class', 'viewport');

    const zoom = d3
      .zoom()
      .scaleExtent([0.3, 2.4])
      .on('zoom', (event) => container.attr('transform', event.transform));

    svg.call(zoom);

    svg.on('dblclick', (event) => {
      if (event.target !== svg.node()) return;
      const [x, y] = d3.pointer(event, container.node());
      createNode({ name: 'New Node', x, y, parentId: selectedNodeId || 'node-root' });
    });

    const idMap = new Map(visibleNodes.map((n) => [n.id, n]));
    const links = visibleNodes
      .filter((node) => node.parentId && idMap.has(node.parentId))
      .map((node) => ({ source: idMap.get(node.parentId), target: node }));

    const simulation = d3
      .forceSimulation(visibleNodes.map((n) => ({ ...n })))
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(120)
          .strength(0.5),
      )
      .force('charge', d3.forceManyBody().strength(-280))
      .force('collide', d3.forceCollide().radius(radius + 12).strength(1))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.02))
      .force('y', d3.forceY(height / 2).strength(0.02));

    const linkSelection = container
      .append('g')
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('stroke', '#818cf8')
      .attr('stroke-opacity', 0.7)
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    const nodeGroup = container
      .append('g')
      .selectAll('g')
      .data(simulation.nodes())
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('click', (_, d) => setSelectedNodeId(d.id))
      .call(
        d3
          .drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.25).restart();
            d.fx = d.x;
            d.fy = d.y;
            setDraggingId(d.id);
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;

            const target = simulation
              .nodes()
              .filter((n) => n.id !== d.id)
              .sort((a, b) => d3.hypot(a.x - d.x, a.y - d.y) - d3.hypot(b.x - d.x, b.y - d.y))[0];

            const closeEnough = target && d3.hypot(target.x - d.x, target.y - d.y) < 78;
            const nextNodes = nodes.map((item) =>
              item.id === d.id
                ? {
                    ...item,
                    x: d.x,
                    y: d.y,
                    parentId:
                      closeEnough && !isDescendant(nodes, d.id, target.id) ? target.id : item.parentId,
                  }
                : item,
            );

            setNodes(nextNodes);
            setDraggingId(null);
          }),
      );

    nodeGroup
      .append('circle')
      .attr('r', radius)
      .attr('fill', (d) => (d.id === selectedNodeId ? '#6366f1' : '#1e293b'))
      .attr('stroke', (d) => (d.id === draggingId ? '#c7d2fe' : '#818cf8'))
      .attr('stroke-width', 2);

    nodeGroup
      .append('text')
      .text((d) => d.name)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e2e8f0')
      .attr('font-size', 11)
      .attr('dy', 4)
      .attr('pointer-events', 'none');

    simulation.on('tick', () => {
      linkSelection.attr('d', (d) => {
        const midX = (d.source.x + d.target.x) / 2;
        const midY = (d.source.y + d.target.y) / 2 - 22;
        return `M${d.source.x},${d.source.y} Q${midX},${midY} ${d.target.x},${d.target.y}`;
      });

      nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [visibleNodes, setNodes, setSelectedNodeId, createNode, nodes, selectedNodeId, draggingId]);

  return <svg ref={svgRef} className="h-[62vh] w-full rounded-xl bg-slate-950/60" />;
}
