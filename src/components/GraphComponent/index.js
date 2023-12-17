'use client';
import { createRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Graph } from '@antv/x6';
import { Button } from 'antd';
import { registryDnd, registrySelection, registrySnapline, registryTransform } from '@/lib/X6PluginRegistry';

import style from './index.module.scss';
import { createPortRect } from '@/utils/generator';

const graphGenerateNodes = [
    {
        type: 'rect',
        style: style['dnd-rect'],
        label: 'rect',
    },
];

const GraphComponent = forwardRef((props, ref) => {
    const graphRef = createRef();
    const dndContainerRef = createRef();

    const graphInstance = useRef();
    const dnd = useRef();

    useEffect(() => {
        graphInstance.current = new Graph({
            container: graphRef.current,
            autoResize: true,
            background: {
                color: '#F2F7FA',
            },
            // 网格
            grid: {
                visible: true,
                type: 'doubleMesh',
            },
            // 平移
            // panning: true,
            // 缩放
            mousewheel: {
                enabled: true,
                //   modifiers: 'Ctrl',
                maxScale: 2,
                minScale: 0.5,
            },
            // 连接规则
            connecting: {
                // 自动吸附
                snap: true,
                highlight: true,
                // 是否允许连接到空白位置
                allowBlank: true,
                // 是否允许创建循环连线(连接到自己)
                allowMulti: true,
                // 是否允许边连接到节点(非节点上的连接桩)
                allowLoop: true,
                // 是否允许边连接到另一个边
                allowNode: true,
                // 是否允许边连接到连接桩
                allowEdge: true,
                // 是否允许在相同的起始节点和终止之间创建多条边
                allowPort: true,
            },
        });
        registrySnapline(graphInstance.current);
        dnd.current = registryDnd(graphInstance.current, dndContainerRef.current);
        registryTransform(graphInstance.current);
        registrySelection(graphInstance.current);

        bindEvent(graphInstance.current);

        graphInstance.current.fromJSON(props.data); // 渲染元素
        graphInstance.current.centerContent(); // 居中显示
    });

    useImperativeHandle(ref, () => {
        return {
            graph: graphInstance.current,
        };
    });
    const getContent = () => {
        console.log(graphInstance.current.toJSON());
    };
    const getSelection = () => {
        console.log(graphInstance.current.getSelectedCells());
    };
    const bindEvent = (graph) => {
        // 删除键删除选中节点
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                graph.removeCells(graph.getSelectedCells());
            }
        });
        // 边添加箭头
        graph.on('edge:mouseenter', ({ cell }) => {
            cell.addTools([
                {
                    name: 'source-arrowhead',
                },
                {
                    name: 'target-arrowhead',
                    args: {
                        attrs: {
                            fill: '#0ea5e9',
                        },
                    },
                },
            ]);
        });
        graph.on('edge:mouseleave', ({ cell }) => {
            cell.removeTool('source-arrowhead');
            cell.removeTool('target-arrowhead');
        });
        // 边鼠标移入显示路径点
        graph.on('edge:mouseenter', ({ cell }) => {
            cell.addTools({
                name: 'vertices',
                args: {
                    modifiers: 'ctrl',
                },
            });
        });
        graph.on('edge:mouseleave', ({ cell }) => {
            if (cell.hasTool('vertices')) {
                cell.removeTool('vertices');
            }
        });
        // 鼠标移入后再显示连接庄
        const showPorts = (ports, show) => {
            for (let i = 0, len = ports.length; i < len; i += 1) {
                ports[i].style.visibility = show ? 'visible' : 'hidden';
            }
        };
        // 要直接显示所有的连接庄，使拖拽时可以连接到连接庄
        graph.on('node:mouseenter', () => {
            const ports = graphRef.current.querySelectorAll('.x6-port-body');
            showPorts(ports, true);
        });
        graph.on('node:mouseleave', () => {
            const ports = graphRef.current.querySelectorAll('.x6-port-body');
            showPorts(ports, false);
        });
    };
    const startDrag = (e) => {
        const target = e.currentTarget;
        const type = target.getAttribute('data-type');
        const nodesMap = {
            rect: () =>
                graphInstance.current.createNode(
                    createPortRect({
                        label: 'Rect',
                    })
                ),
            circle: () =>
                graphInstance.current.createNode({
                    width: 60,
                    height: 60,
                    shape: 'circle',
                    label: 'Circle',
                    attrs: {
                        body: {
                            stroke: '#8f8f8f',
                            strokeWidth: 1,
                            fill: '#fff',
                        },
                    },
                }),
        };
        const node = nodesMap[type]();

        dnd.current.start(node, e.nativeEvent);
    };

    return (
        <div className={style.content}>
            <div className={style.graph_control}>
                <Button
                    className={style.button}
                    onClick={getContent}
                >
                    getContent
                </Button>
                <Button
                    className={style.button}
                    onClick={getSelection}
                >
                    getSelection
                </Button>
            </div>
            <div
                className={style.dnd_wrap}
                ref={dndContainerRef}
            >
                {graphGenerateNodes.map((item) => (
                    <div
                        key={item.type}
                        data-type={item.type}
                        className={item.style}
                        onMouseDown={startDrag}
                    >
                        {item.label}
                    </div>
                ))}
            </div>

            <div
                ref={graphRef}
                className={style.graph}
            >
                StyledComponentsRegistry
            </div>
        </div>
    );
});

export default GraphComponent;
