import HAST from 'hast';
import propInfo from 'property-information';
import { CreateElement, VNode, VNodeData } from 'vue';

function isHASTTextNode(node: any): node is HAST.TextNode {
  return node && node.type === 'text';
}

function toAttribute(prop: string): string {
  const svgProp = propInfo.svg.property[prop];
  if (svgProp) {
    return svgProp.attribute;
  }
  return propInfo.find(propInfo.html, prop).attribute;
}

type VNodeDataModifier = (data: VNodeData, props: HAST.ElementProperties) => VNodeData;

function toVNodeData(props: HAST.ElementProperties, mod?: VNodeDataModifier): VNodeData {
  const data: VNodeData = { attrs: {} };

  // tslint:disable-next-line:forin
  for (const key in props) {
    if (key === 'className') {
      data.class = props.className;
      continue;
    }
    data.attrs![toAttribute(key)] = props[key];
  }

  return mod ? mod(data, props) : data;
}

export default function toVNode(h: CreateElement, node: HAST.TextNode): string;
export default function toVNode(
  h: CreateElement,
  node: HAST.Element,
  children: Array<HAST.TextNode | HAST.Element>,
  mod?: VNodeDataModifier,
): VNode;
export default function toVNode(
  h: CreateElement,
  node: HAST.TextNode | HAST.Element,
  children?: Array<HAST.TextNode | HAST.Element>,
  mod?: VNodeDataModifier,
): VNode | string {
  if (isHASTTextNode(node)) {
    return node.value;
  }
  return h(node.tagName, toVNodeData(node.properties, mod), children!.map((child) => {
    return isHASTTextNode(child) ? toVNode(h, child) : toVNode(h, child, child.children, mod);
  }));
}
