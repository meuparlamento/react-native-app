import { zoomIn, zoomOut, fromRight } from 'react-navigation-transitions';

export default handleCustomTransition = ({ scenes }) => {
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];
  
    // Custom transitions go there
    if (
      prevScene &&
      prevScene.route.routeName === 'CardGame' &&
      nextScene.route.routeName === 'Summary'
    ) {
      return zoomIn();
    }
    if (
      prevScene &&
      prevScene.route.routeName === 'Summary' &&
      nextScene.route.routeName === 'CardGame'
    ) {
      return zoomOut();
    }
    return fromRight();
  };