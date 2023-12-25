import { useState, useEffect } from 'react';
import { Button, Radio, Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import Text from '@/assets/svg/text.svg';
import TextColor from '@/assets/svg/textColor.svg';
import TextBackground from '@/assets/svg/textBackground.svg';
import { Edit } from '@/assets/const/toolName';
import MyColorPicker from '@/components/ColorPicker';
import style from './index.module.scss';

const InitalEdit = '';
const InitalTextColor = '#000000ff';
const InitalTextBackgroundColor = '#ffffff00';

const GraphTools = ({ graph }) => {
    const [editText, setEditText] = useState(InitalEdit);
    const [textColor, setTextColor] = useState(InitalTextColor);
    const [textBackgroundColor, setTextBackgroundColor] = useState(InitalTextBackgroundColor);
    const changeEditText = (e) => {
        setEditText(editText === e.target.value ? '' : e.target.value);
    };

    useEffect(() => {
        // 点击空白处添加文本
        const handleAddLabel = ({ x, y }) => {
            graph.current.addNode({
                shape: 'text',
                x,
                y,
                width: 80,
                height: 36,
                text: 'text',
                attrs: {
                    text: {
                        fill: textColor,
                    },
                    body: {
                        fill: textBackgroundColor,
                    },
                },
            });
        };
        // 点击空白处新增文本
        editText === Edit && graph.current.on('blank:click', handleAddLabel);
        // 选中节点后修改文本样式;
        graph.current.getSelectedCells().map((cell) => {
            if (cell.isEdge()) {
                const labels = cell.getLabels();
                labels.map((_, i) => {
                    cell.prop(`labels/${i}/attrs/label/fill`, textColor);
                    cell.prop(`labels/${i}/attrs/body/fill`, textBackgroundColor);
                });
            } else {
                cell.setAttrs({
                    text: {
                        fill: textColor,
                    },
                    body: {
                        fill: textBackgroundColor,
                    },
                });
            }
        });
        return () => {
            graph.current.off('blank:click', handleAddLabel);
        };
    }, [editText, textColor, textBackgroundColor]);

    const getAttrs = () => {
        // 获取选中的节点中的文本属性
        const getTextAttr = (cell) => {
            if (cell.isEdge()) {
                const labels = cell.getLabels();
                let labelTextColor = InitalTextColor;
                let labelTextBackgroundColor = InitalTextColor;
                if (labels.length) {
                    labelTextColor = cell.getProp('labels/0/attrs/label/fill', InitalTextColor);
                    labelTextBackgroundColor = cell.getProp('labels/0/attrs/body/fill', InitalTextBackgroundColor);
                    for (let i = 1; i < labels.length; i++) {
                        const curLabelTextColor = cell.getProp(`labels/${i}/attrs/label/fill`, undefined);
                        const curLabelTextBackgroundColor = cell.getProp(`labels/${i}/attrs/body/fill`, undefined);
                        if (
                            curLabelTextColor !== labelTextColor ||
                            curLabelTextBackgroundColor !== labelTextBackgroundColor
                        ) {
                            labelTextColor = InitalTextColor;
                            labelTextBackgroundColor = InitalTextBackgroundColor;
                            break;
                        }
                    }
                }
                return {
                    fill: labelTextColor,
                    backgroundColor: labelTextBackgroundColor,
                };
            } else {
                const attrs = cell.getAttrs();
                return {
                    fill: attrs.text.fill,
                    backgroundColor: attrs.body.fill,
                };
            }
        };
        const cells = graph.current.getSelectedCells();
        const startCell = getTextAttr(cells[0]);
        let textColor = startCell?.fill || InitalTextColor;
        let textBackgroundColor = startCell.backgroundColor || InitalTextBackgroundColor;
        for (let i = 1; i < cells.length; i++) {
            const attrs = getTextAttr(cells[i]);
            if (attrs?.fill !== textColor) {
                textColor = InitalTextColor;
                textBackgroundColor = InitalTextBackgroundColor;
                break;
            }
        }
        setTextColor(textColor);
        setTextBackgroundColor(textBackgroundColor);
    };
    useEffect(() => {
        // 选中节点的文本样式
        graph.current.on('cell:selected', getAttrs);
        return () => {
            graph.current.off('cell:selected', getAttrs);
        };
    }, [graph]);

    return (
        <div className={style.tool_control}>
            <Radio.Group
                value={editText}
                onChange={changeEditText}
            >
                <Radio.Button
                    value={Edit}
                    onClick={changeEditText}
                >
                    <Icon component={Text} />
                </Radio.Button>
            </Radio.Group>
            <MyColorPicker
                value={textColor}
                onChange={setTextColor}
            >
                <Button
                    icon={<Icon component={TextColor} />}
                    style={{ color: textColor }}
                ></Button>
            </MyColorPicker>
            <MyColorPicker
                value={textBackgroundColor}
                onChange={setTextBackgroundColor}
            >
                <Button
                    icon={<Icon component={TextBackground} />}
                    style={{ color: textBackgroundColor }}
                ></Button>
            </MyColorPicker>
        </div>
    );
};

export default GraphTools;
