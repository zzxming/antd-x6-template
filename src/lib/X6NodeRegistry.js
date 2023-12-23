import { Graph } from '@antv/x6';
import { Dom, ObjectExt } from '@antv/x6-common';
import { Base } from '@antv/x6/lib/shape/base';

Graph.registerNode('text', {
    markup: [
        {
            tagName: 'rect',
            selector: 'body',
        },
        {
            tagName: 'text',
            selector: 'label',
            attrs: {
                textAnchor: 'middle',
            },
        },
    ],
    tools: [
        {
            name: 'node-editor',
            args: {
                getText: 'label/text',
                setText: 'label/text',
            },
        },
    ],
    attrs: {
        body: {
            ...Base.bodyAttr,
            refWidth: '100%',
            refHeight: '100%',
            strokeWidth: 0,
            fill: 'none',
        },
        label: {
            style: {
                fontSize: 14,
            },
        },
    },
    propHooks(metadata) {
        const { text, ...others } = metadata;
        if (text) {
            ObjectExt.setByPath(others, 'attrs/label/text', text);
        }
        return others;
    },
    attrHooks: {
        text: {
            set(text, { cell, view, refBBox, elem, attrs }) {
                if (elem instanceof HTMLElement) {
                    elem.textContent = text;
                } else {
                    const style = attrs.style || {};
                    Dom.text(elem, text, { textVerticalAnchor: 'middle' });
                    return { fill: style.color || null };
                }
            },
            position(text, { refBBox, elem }) {
                if (elem instanceof SVGElement) {
                    return refBBox.getCenter();
                }
            },
        },
    },
});
