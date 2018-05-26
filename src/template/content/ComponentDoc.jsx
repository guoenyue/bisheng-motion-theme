import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { Row, Col, Icon, Affix } from 'antd';
import { getChildren } from 'jsonml.js/lib/utils';
// import Demo from './Demo';
import EditButton from './EditButton';

export default class ComponentDoc extends React.Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      expandAll: false,
    };
  }

  handleExpandToggle = () => {
    this.setState({
      expandAll: !this.state.expandAll,
    });
  }

  render() {
    const { props } = this;
    const { doc, location } = props;
    const { content, meta } = doc;
    const { locale } = this.context.intl;
    const demos = Object.keys(props.demos).map(key => props.demos[key]);
    const expand = this.state.expandAll;

    const isSingleCol = meta.cols === 1;
    const leftChildren = [];
    const rightChildren = [];
    const showedDemo = demos.some(demo => demo.meta.only) ?
      demos.filter(demo => demo.meta.only) : demos.filter(demo => demo.preview);
    showedDemo.sort((a, b) => a.meta.order - b.meta.order)
      .forEach((demoData, index) => {
        const demoElem = (
          <div></div>
        );
        if (index % 2 === 0 || isSingleCol) {
          leftChildren.push(demoElem);
        } else {
          rightChildren.push(demoElem);
        }
      });
    const expandTriggerClass = `code-box-expand-trigger ${expand ? 'code-box-expand-trigger-active' : ''}`;

    const jumper = showedDemo.map((demo) => {
      const { title } = demo.meta;
      const localizeTitle = title[locale] || title;
      return (
        <li key={demo.meta.id} title={localizeTitle}>
          <a href={`#${demo.meta.id}`}>
            {localizeTitle}
          </a>
        </li>
      );
    });

    const { title, subtitle, filename } = meta;
    return (
      <DocumentTitle title={`${subtitle || ''} ${title[locale] || title} - Ant Design`}>
        <article>
          <Affix className="toc-affix" offsetTop={16}>
            <ul id="demo-toc" className="toc">
              {jumper}
            </ul>
          </Affix>
          <section className="markdown">
            <h1>
              {title[locale] || title}
              {
                !subtitle ? null : <span className="subtitle">{subtitle}</span>
              }
              <EditButton title='' filename={filename} />
            </h1>
            {
              props.utils.toReactComponent(
                ['section', { className: 'markdown' }]
                  .concat(getChildren(content))
              )
            }
            <h2>
              <Icon
                type="appstore"
                className={expandTriggerClass}
                title={expand ? '收起全部代码' : '展开全部代码'}
                onClick={this.handleExpandToggle}
              />
            </h2>
          </section>
          <Row gutter={16}>
            <Col span={isSingleCol ? '24' : '12'}
                 className={isSingleCol ?
                   'code-boxes-col-1-1' :
                   'code-boxes-col-2-1'
                 }
            >
              {leftChildren}
            </Col>
            {
              isSingleCol ? null : <Col className="code-boxes-col-2-1" span={12}>{rightChildren}</Col>
            }
          </Row>
          {
            props.utils.toReactComponent(
              ['section', {
                className: 'markdown api-container',
              }].concat(getChildren(doc.api || ['placeholder']))
            )
          }
        </article>
      </DocumentTitle>
    );
  }
}
