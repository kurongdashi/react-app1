// 引入环境变量
import './public-path';
import React, { Suspense } from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import Entry from './Entry';
import './App.less';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import reducer from '@/store/reducer';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import '@/mock/index';
import { ConfigProvider } from 'antd';
// antd 组件的本地化语言设置
import zhCN from 'antd/locale/zh_CN';
// antd中使用了dayjs处理日期，还需dayjs 本地化
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
import { runAfterFirstMounted } from 'qiankun';
// 可合并reducer
// const reduceMerge=combineReducers(reducer);
// 使用applyMiddleware 中间件，可以支持action 返回一个方法
const store = createStore(reducer, applyMiddleware(thunk));
// 做 provider 层

const App = () => {
  return (
    // antd 配置
    <ConfigProvider
      theme={{ token: { colorPrimary: '#1890ff' } }}
      locale={zhCN}
    >
      {/* redux store */}
      <Provider store={store}>
        <Entry />
      </Provider>
    </ConfigProvider>
  );
};
const render = (props?: any) => {
  debugger;
  const root = createRoot(
    props.container
      ? props.container.querySelector('#root')
      : document.getElementById('root')
  );
  root.render(<App />);
};
// 非乾坤还是走原来的逻辑
console.log(
  '(window as any).__POWERED_BY_QIANKUN__',
  (window as any).__POWERED_BY_QIANKUN__
);
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({});
}
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  const obj = props.singleSpa.getAppStatus();
  console.log('react app1 mount', props, obj);
  props.onGlobalStateChange((state, prev) => {
    console.log('子应用1监听state', state, prev);
    render(props);
  });
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props: any) {
  console.log('react app unmount');
  const root = createRoot(
    props.container
      ? props.container.querySelector('#root')
      : document.getElementById('root')
  );
  root.unmount();
}
// 首个子应用加载后，可执行回调
runAfterFirstMounted(() => {
  console.log('第一个子应用启动了~');
});
