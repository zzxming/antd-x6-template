import { Graph } from '@antv/x6';
import { Dom, ObjectExt, FunctionExt } from '@antv/x6-common';
import { Attr } from '@antv/x6/lib/registry';
import { Base } from '@antv/x6/lib/shape/base';

// Graph.registerNode('combine-cell', {
//     inherit: 'rect',

// })

Graph.registerNode('text', {
    markup: [
        {
            tagName: 'rect',
            selector: 'body',
        },
        {
            tagName: 'text',
            selector: 'text',
            attrs: {
                textAnchor: 'middle',
            },
        },
    ],
    tools: [
        {
            name: 'node-editor',
            args: {
                getText: 'text/text',
                setText: 'text/text',
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
        text: {
            fontSize: 14,
        },
    },
    propHooks(metadata) {
        const { text, ...others } = metadata;
        if (text) {
            ObjectExt.setByPath(others, 'attrs/text/text', text);
        }
        return others;
    },
    attrHooks: {
        text: {
            set(text, { cell, view, refBBox, elem, attrs }) {
                if (elem instanceof HTMLElement) {
                    elem.textContent = text;
                } else {
                    Dom.text(elem, text, { textVerticalAnchor: 'middle' });
                    // No foreign object
                    const style = attrs || {};
                    const wrapValue = { text, width: -5, height: '100%' };
                    const wrapAttrs = {
                        textVerticalAnchor: 'middle',
                        ...style,
                    };
                    const textWrap = Attr.presets.textWrap;
                    FunctionExt.call(textWrap.set, this, wrapValue, {
                        cell,
                        view,
                        elem,
                        refBBox,
                        attrs: wrapAttrs,
                    });
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
