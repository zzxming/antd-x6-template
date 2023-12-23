import { Snapline } from '@antv/x6-plugin-snapline';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Transform } from '@antv/x6-plugin-transform';
import { Selection } from '@antv/x6-plugin-selection';

export const registrySnapline = (graphInstance) => {
    graphInstance.use(
        new Snapline({
            enabled: true,
            sharp: true,
        })
    );
};

export const registryDnd = (graphInstance, dndContainer, validateNode) => {
    return new Dnd({
        target: graphInstance,
        scaled: false,
        dndContainer, // 再此 dom 节点放开鼠标不会放置节点
        validateNode,
    });
};

export const registryTransform = (graphInstance) => {
    graphInstance.use(
        new Transform({
            resizing: {
                enabled: true,
                // minWidth: 36,
                // minHeight: 36,
                maxWidth: 200,
                maxHeight: 150,
                orthogonal: false, //调整大小边界是否可以超出画布边缘
                autoScroll: true, // 调整大小过程中是否保持节点的宽高比例
                restrict: false, // 调整大小边界是否可以超出画布边缘
                preserveAspectRatio: false, // 调整大小过程中是否保持节点的宽高比例
            },
            rotating: {
                enabled: true,
                grid: 15, // 每次旋转角度
            },
        })
    );
};

export const registrySelection = (graphInstance) => {
    graphInstance.use(
        new Selection({
            enabled: true,
            multiple: true, // 多选，启用后按住 modifiers 配置的按键点击节点实现多选
            multipleSelectionModifiers: ['shift'],
            rubberband: false, // 框选节点功能
            movable: false, // 拖动选框时框选的节点是否一起移动
            showNodeSelectionBox: true, // 是否显示节点的选择框
            // showEdgeSelectionBox: true, //是否显示边的选择框
            pointerEvents: 'none', // 如果打开 showNodeSelectionBox 时，会在节点上方盖一层元素，导致节点的事件无法响应，此时可以配置 pointerEvents: none 来解决，默认值是 auto
        })
    );
};
