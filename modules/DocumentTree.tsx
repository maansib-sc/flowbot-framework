import { useEffect, useRef, useState } from 'react';
import { Node, Edge, DocumentTreeData } from '@/types/documentTree';
import * as d3 from 'd3';

const DocumentTree = ({ data }: { data: DocumentTreeData }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Edge[]>([]);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        const updateDimensions = () => {
            if (svgRef.current) {
                setDimensions({
                    width: svgRef.current.clientWidth,
                    height: svgRef.current.clientHeight,
                });
            }
        };

        // setting initial dimensions
        updateDimensions();
        // updating dimensions on window resize
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (data?.edges?.length > 0 && data?.nodes?.length > 0) {
            setNodes(data.nodes);
            setLinks(data.edges);
        }
    }, [data]);

    useEffect(() => {
        if (!svgRef.current || nodes.length === 0) return;

        const { width, height } = dimensions;
        const nodeRadius = 20;

        // clearing the SVG to prevent duplicates
        d3.select(svgRef.current).selectAll("*").remove();
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        const graphGroup = svg.append('g');
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 10])
            .on('zoom', (event: any) => {
                graphGroup.attr('transform', event.transform);
            });

        svg.call(zoom);

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id((d: any) => d.id).distance(40))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));

        const link = graphGroup.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 1);

        const linkText = graphGroup.append('g')
            .selectAll('text')
            .data(links)
            .join('text')
            .attr('font-size', '12px')
            .attr('fill', '#69b3a2')
            .attr('text-anchor', 'middle')
            .text(d => d.type);

        const node = graphGroup.append('g')
            .selectAll('g')
            .data(nodes)
            .join('g')
            .call(d3.drag<SVGGElement, Node>()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended) as any);

        // add circle for all nodes
        node.append('circle')
            .attr('r', nodeRadius)
            .attr('fill', '#69b3a2')
            .attr('stroke', '#69b3a2')
            .attr('stroke-width', 1);

        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', -30)
            .style('display', 'none')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .text(d => d.id);

        node
            .on('mouseover', function () {
                d3.select(this)
                    .select('text')
                    .style('display', 'block');
            })
            .on('mouseout', function () {
                d3.select(this)
                    .select('text')
                    .style('display', 'none');
            });

        node.append('title')
            .text(d => d.id);

        simulation.on('tick', () => {
            link
                .attr('x1', d => (d.source as Node).x!)
                .attr('y1', d => (d.source as Node).y!)
                .attr('x2', d => (d.target as Node).x!)
                .attr('y2', d => (d.target as Node).y!);

            linkText
                .attr('x', d => ((d.source as Node).x! + (d.target as Node).x!) / 2)
                .attr('y', d => ((d.source as Node).y! + (d.target as Node).y!) / 2)
                .attr('transform', d => {
                    const dx = (d.target as Node).x! - (d.source as Node).x!;
                    const dy = (d.target as Node).y! - (d.source as Node).y!;
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    const x = ((d.source as Node).x! + (d.target as Node).x!) / 2;
                    const y = ((d.source as Node).y! + (d.target as Node).y!) / 2;
                    return `rotate(${angle}, ${x}, ${y})`;
                });

            node
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });

        simulation.on('end', () => {
            const bounds = graphGroup.node()?.getBBox();

            if (bounds && bounds.width > 0 && bounds.height > 0) {
                const scale = Math.min(
                    1,
                    Math.min(
                        width / bounds.width,
                        height / bounds.height
                    ) * 0.9
                );

                const translateX =
                    width / 2 - scale * (bounds.x + bounds.width / 2);

                const translateY =
                    height / 2 - scale * (bounds.y + bounds.height / 2);

                svg.call(
                    zoom.transform,
                    d3.zoomIdentity
                        .translate(translateX, translateY)
                        .scale(scale)
                );
            }
        });

        function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return () => {
            simulation.stop();
        };
    }, [nodes, links, dimensions]);

    return <div className="w-full h-full">
        <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
};

export default DocumentTree;