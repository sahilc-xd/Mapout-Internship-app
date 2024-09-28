import React from 'react';
import renderer from 'react-test-renderer';
import OnboardingScreen from '../src/newScreens/OnboardingScreen';

test('Onboarding screen renders correctly', () => {
  const tree = renderer.create(<OnboardingScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});