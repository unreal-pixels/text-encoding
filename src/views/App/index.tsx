import React from 'react';
import './App.scss';
import { GoogleAd, Header, Wrapper } from '@unrealpixels/common-lib';
import { type RouteComponentProps, withRouter } from 'react-router-dom';

class App extends React.Component<RouteComponentProps> {
  state = {
    encodingText: '',
    decodingText: '',
    error: false,
    errorReason: '',
    encodeUrl: true,
    base64: true,
    jsonString: false,
  };

  private encode = (): void => {
    const { encodingText, encodeUrl, base64, jsonString } = this.state;

    try {
      let finalValue = encodingText;

      if (jsonString) {
        finalValue = JSON.stringify(JSON.parse(finalValue));
      }

      if (encodeUrl) {
        finalValue = encodeURIComponent(finalValue);
      }

      if (base64) {
        finalValue = btoa(finalValue);
      }

      this.setState({ error: false, decodingText: finalValue });
    } catch (error) {
      this.setState({ error: true, errorReason: String(error) });
    }
  };

  private decode = (): void => {
    const { decodingText, encodeUrl, base64, jsonString } = this.state;

    try {
      let finalValue = decodingText;

      if (base64) {
        finalValue = atob(finalValue);
      }

      if (encodeUrl) {
        finalValue = decodeURIComponent(finalValue);
      }

      if (jsonString) {
        finalValue = JSON.stringify(JSON.parse(finalValue), undefined, 2);
      }

      this.setState({ error: false, encodingText: finalValue });
    } catch (error) {
      this.setState({ error: true, errorReason: String(error) });
    }
  };

  componentDidMount (): void {
    const { history } = this.props;
    const route = localStorage.getItem('route');

    if (route) {
      localStorage.removeItem('route');
      history.push(route);
    }
  }

  render (): React.ReactNode {
    const { encodingText, decodingText, error, errorReason, encodeUrl, base64, jsonString } = this.state;

    const options = (
      <div className="options">
        <label className="checkbox-option">
          <input type="checkbox" checked={encodeUrl} onChange={() => { this.setState({ encodeUrl: !encodeUrl }); }} />
          {'URL Encode/Decode'}
        </label>
        <label className="checkbox-option">
          <input type="checkbox" checked={base64} onChange={() => { this.setState({ base64: !base64 }); }} />
          {'Base64 Encode/Decode'}
        </label>
        <label className="checkbox-option">
          <input type="checkbox" checked={jsonString} onChange={() => { this.setState({ jsonString: !jsonString }); }} />
          {'JSON String'}
        </label>
      </div>
    );

    return (
      <>
        <Header productName="Text Encoder/Decoder" productId="text-encoding" />
        <Wrapper>
          {error && <div className="data-error"><pre>{errorReason}</pre></div>}
          <div className="data-entry--wrapper">
            <div className="data-entry--area">
              <label className="data-entry--label" htmlFor="data-entry">Text to Encode</label>
              <textarea className="data-entry" rows={25} id='data-entry' value={encodingText} onChange={event => { this.setState({ encodingText: event.target.value }); }} />
              {options}
              <button type="button" className="data-entry--button" disabled={!encodingText} onClick={this.encode}>Encode Text</button>
            </div>
            <div className="data-entry--area">
              <label className="data-entry--label" htmlFor="data-entry">Text to Decode</label>
              <textarea className="data-entry" rows={25} id='data-entry' value={decodingText} onChange={event => { this.setState({ decodingText: event.target.value }); }} />
              {options}
              <button type="button" className="data-entry--button" disabled={!decodingText} onClick={this.decode}>Decode Text</button>
            </div>
          </div>
          <GoogleAd adSlot="3684249047" />
        </Wrapper>
      </>
    );
  }
}

export default withRouter(App);
