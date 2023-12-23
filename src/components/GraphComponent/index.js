'use client';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Graph, Shape } from '@antv/x6';
import { Button } from 'antd';
import { registryDnd, registrySelection, registrySnapline, registryTransform } from '@/lib/X6PluginRegistry';
import '@/lib/X6GraphConnectorRegistry';

import style from './index.module.scss';
import GraphDnd from '@/components/GraphDnd';
import EdgeAttrs from '@/components/EdgeAttrs';
import GraphTools from '@/components/GraphTools';
import { createEdge } from '@/utils/generator';
import { textEdit } from '@/assets/const/toolName';
import '@/lib/X6NodeRegistry';

const GraphComponent = forwardRef((props, ref) => {
    const graphRef = useRef();
    const dndContainerRef = useRef();

    const graphInstance = useRef();
    const dnd = useRef();

    const [lineType, setLineType] = useState('');
    const [lineColor, setLineColor] = useState('#000000');

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
            // mousewheel: {
            //     enabled: true,
            //     //   modifiers: 'Ctrl',
            //     maxScale: 2,
            //     minScale: 0.5,
            // },
            // 连接规则.https://x6.antv.antgroup.com/api/model/interaction
            connecting: {
                router: 'orth', //路由将边的路径点 vertices 做进一步转换处理，并在必要时添加额外的点.https://x6.antv.antgroup.com/api/registry/router
                snap: true, // 自动吸附
                highlight: true,
                allowBlank: true, // 是否允许连接到空白位置
                allowMulti: true, // 是否允许在相同的起始节点和终止之间创建多条边
                allowLoop: false, // 是否允许创建循环连线(连接到自己)
                allowNode: true, // 是否允许边连接到节点（非节点上的连接桩）
                allowEdge: true, // 是否允许边连接到另一个边
                allowPort: true, // 是否允许边连接到连接桩
            },
        });

        registrySnapline(graphInstance.current);
        dnd.current = registryDnd(graphInstance.current, dndContainerRef.current);
        registryTransform(graphInstance.current);
        registrySelection(graphInstance.current);

        bindEvent(graphInstance.current);

        graphInstance.current.fromJSON(props.data); // 渲染元素
        graphInstance.current.centerContent(); // 居中显示
    }, []);

    useImperativeHandle(ref, () => {
        return {
            graph: graphInstance,
        };
    });
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

        bindTextBlockEvent(graph);
    };
    const bindTextBlockEvent = (graph) => {
        // 文本框大小改变时取消选中，为响应改变后的高度
        graph.on('cell:change:size', ({ cell }) => {
            if (cell.shape === 'text-block') {
                graph.unselect(cell);
            }
        });
        // 文本框选中后改变文本框大小使文本不超出
        graph.on('cell:selected', ({ cell }) => {
            if (cell.shape === 'text-block') {
                const label = graph.findViewByCell(cell)?.selectors.label;
                const { width, height } = cell.size();
                if (label) {
                    cell.setSize(Math.max(label.clientWidth, width), Math.max(label.clientHeight, height));
                }
            }
        });
    };
    // 切换连接线类型
    useEffect(() => {
        graphInstance.current.options.connecting.createEdge = () => {
            return graphInstance.current.createEdge(
                createEdge({
                    attrs: {
                        line: {
                            strokeDasharray: lineType === 'dash' ? 5 : 0,
                            stroke: lineColor,
                        },
                    },
                    connector: {
                        name: lineType === 'wave' ? 'wavy' : 'normal',
                    },
                })
            );
        };
    }, [lineType, lineColor]);

    const addLabel = useCallback(
        ({ x, y }) => {
            graphInstance.current.addNode({
                shape: 'text',
                x,
                y,
                width: 80,
                height: 36,
                text: 'text',
            });
        },
        [graphInstance]
    );

    const [curTool, setCurTool] = useState('');
    useEffect(() => {
        if (!graphInstance.current) return;
        const map = {};
        if (curTool === textEdit) {
            graphInstance.current.on('blank:click', addLabel);
        } else {
            graphInstance.current.off('blank:click', addLabel);
        }
    }, [curTool]);

    // Dnd 拖拽
    const startDrag = (e, node) => {
        dnd.current.start(node, e.nativeEvent);
    };

    const getContent = () => {
        console.log(graphInstance.current.toJSON());
    };
    const getSelection = () => {
        console.log(graphInstance.current.getSelectedCells());
    };
    return (
        <div className={style.graph_wrap}>
            <div className={style.graph_console}>
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
            <div className={style.graph_control}>
                <EdgeAttrs
                    lineType={lineType}
                    lineTypeChange={setLineType}
                    lineColor={lineColor}
                    lineColorChange={setLineColor}
                />
                <GraphTools
                    value={curTool}
                    onChange={setCurTool}
                />
                <GraphDnd
                    ref={dndContainerRef}
                    graph={graphInstance}
                    startDrag={startDrag}
                />
            </div>
            <div
                ref={graphRef}
                className={style.graph}
            ></div>
        </div>
    );
});

export default GraphComponent;
