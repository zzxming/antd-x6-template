'use client';
import { createRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Graph } from '@antv/x6';
import { Button } from 'antd';
import { registryDnd, registrySnapline } from '@/lib/X6PluginRegistry';

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
            panning: true,
            // 缩放
            mousewheel: {
                enabled: true,
                //   modifiers: 'Ctrl',
                maxScale: 2,
                minScale: 0.2,
            },
            // 连接规则
            connecting: {
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
            <Button
                className={style.button}
                onClick={getContent}
            >
                getContent
            </Button>
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
