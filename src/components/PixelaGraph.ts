import axios from 'axios';
import HAST from 'hast';
import { CreateElement, VNode } from 'vue';
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import parse from '../rehype/parser';
import toVNode from '../rehype/to-vnode';

@Component
export default class PixelaGraph extends Vue {
  @Prop() private username!: string;
  @Prop() private graphId!: string;
  @Prop() private date?: string;
  @Prop() private mode?: string;

  private svg: string | null = '';

  get queryParameters() {
    const qp = [];

    if (this.date) {
      qp.push(`date=${this.date}`);
    }
    if (this.mode) {
      qp.push(`mode=${this.mode}`);
    }

    return qp.length === 0 ? '' : `?${qp.join('&')}`;
  }

  get graphUrl() {
    return `https://pixe.la/v1/users/${this.username}/graphs/${this.graphId}${this.queryParameters}`;
  }

  @Watch('graphUrl', { immediate: true })
  public fetchGraph() {
    axios.get(this.graphUrl, { responseType: 'text' })
      .then((res) => {
        this.svg = res.data;
      })
      .catch((err) => {
        this.svg = null;
      });
  }

  @Emit('clickDate')
  public onClickDate(date: string, count: number) {
    return { date, count };
  }

  public render(h: CreateElement): VNode {
    if (!this.svg) {
      return h('div');
    }

    const dummyRoot: HAST.Element = {
      type: 'element',
      tagName: 'div',
      properties: { className: ['pixela-graph'] },
      children: parse(this.svg).children,
    };
    return toVNode(h, dummyRoot, dummyRoot.children, (data, props) => {
      if (props.className === undefined || props.className.indexOf('each-day') === -1) {
        return data;
      }
      return {
        ...data,
        on: {
          click: () => {
            this.onClickDate(data.attrs!['data-date'], parseInt(data.attrs!['data-count'], 10));
          },
        },
      };
    });
  }
}
