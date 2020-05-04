import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  Header,
  Image,
  Segment,
  Input,
  Select,
  Grid,
  Divider,
} from 'semantic-ui-react';

import config from '../../../config';

import {
  setTheme,
  setTitle,
  setUsername,
  setLoadRequest,
  setIsReady,
  setAssetsPath,
} from '../../redux-store/PresentationReducer/actions';

import {
  getTheme,
  getTitle,
  getAssetsPath,
  getUsername,
} from '../../redux-store/PresentationReducer/selectors';
import './index.css';
import history from '../../../utils/history';
import cernLogoPath from '../../../cernLogo/CERN-Logo.png';

const themeOptions = [
  {
    key: 'CERN 1',
    text: 'CERN 1',
    value: 'CERN 1',
  },
  {
    key: 'CERN 2',
    text: 'CERN 2',
    value: 'CERN 2',
  },
  {
    key: 'CERN 3',
    text: 'CERN 3',
    value: 'CERN 3',
  },
  {
    key: 'CERN 4',
    text: 'CERN 4',
    value: 'CERN 4',
  },
  {
    key: 'CERN 5',
    text: 'CERN 5',
    value: 'CERN 5',
  },
  {
    key: 'CERN 6',
    text: 'CERN 6',
    value: 'CERN 6',
  },
];

function LandingPage({
  onSetTheme,
  onSetTitle,
  onSetUsername,
  currentTheme,
  currentTitle,
  currentUser,
  onSetIsReady,
  onLoadRequest,
  assetsPath,
  onSetAssetsPath,
}) {
  const [title, setTi] = useState(currentTitle);
  const [theme, setTh] = useState(currentTheme);
  const [user, setUser] = useState(currentUser);

  const clickHandlerNew = () => {
    onSetTitle(title);
    onSetTheme(theme);
    history.push(`/${user}/${title}/edit/`);
    // make a uuid for this Presentation:
    onSetUsername(user);
    // ready
    onSetIsReady();
  };

  const clickHandlerLoad = () => {
    // set LoadReq
    onLoadRequest();
    // load component will take over and load content
  };

  const settingTitle = (e, { value }) => setTi(value);
  const settingTheme = (e, { value }) => setTh(value);
  const settingUser = (e, { value }) => setUser(value);

  // set the assetsFolder, where images will be, in the redux store
  if (assetsPath === '') onSetAssetsPath(config.assetsPath);
  // const cernLogoPath = `./cernlogo/CERN-Logo.png`;
  return (
    <div className="landing-page">
      <Image src={cernLogoPath} className="image" centered />
      <Grid columns={2} relaxed="very" stackable textAlign="center">
        <Grid.Row>
          <Grid.Column width={12}>
            <Header className="white" as="h2">
              Start New Presentation
            </Header>
            <Form size="large">
              <Segment>
                <Input
                  className="spacing"
                  placeholder="Username"
                  fluid
                  onChange={settingUser}
                />
                <Input
                  className="spacing"
                  placeholder="Presentation Title"
                  fluid
                  onChange={settingTitle}
                />
                <Select
                  className="spacing"
                  placeholder="Select Theme"
                  fluid
                  options={themeOptions}
                  onChange={settingTheme}
                />
                <Button color="green" onClick={clickHandlerNew}>
                  <Button.Content visible>Let's GO!</Button.Content>
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
          <Divider horizontal>Or</Divider>
          {/* this width makes the Header text take all the required space to be inline */}
          <Grid.Column width={10}>
            <Header className="white" as="h2">
              Edit Existing Presentation
            </Header>
            <Button color="blue" onClick={clickHandlerLoad}>
              <Button.Content visible>Upload!</Button.Content>
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

LandingPage.propTypes = {
  onSetTheme: PropTypes.func,
  onSetTitle: PropTypes.func,
  onSetUsername: PropTypes.func,
  currentTheme: PropTypes.string,
  currentTitle: PropTypes.string,
  currentUser: PropTypes.string,
  onSetIsReady: PropTypes.func,
  onLoadRequest: PropTypes.func,
  assetsPath: PropTypes.string,
  onSetAssetsPath: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSetTheme: theme => dispatch(setTheme(theme)),
    onSetTitle: title => dispatch(setTitle(title)),
    onSetUsername: user => dispatch(setUsername(user)),
    onLoadRequest: () => dispatch(setLoadRequest(true)),
    onSetIsReady: () => dispatch(setIsReady(true)),
    onSetAssetsPath: path => dispatch(setAssetsPath(path)),
  };
}

export default connect(
  state => ({
    currentTheme: getTheme(state),
    currentTitle: getTitle(state),
    currentUser: getUsername(state),
    assetsPath: getAssetsPath(state),
  }),
  mapDispatchToProps,
)(LandingPage);