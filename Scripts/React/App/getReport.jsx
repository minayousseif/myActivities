/*
INLINE EVENT HANDLERS?
First XML in my JavaScript and now inline handlers. I hope React doesn't hate the world. 
We know that inline onclicks are a bad practice in HTML, but not in React I think.
*/
var ErrorAlert = React.createClass({
    getInitialState: function () {
        return {
            showError: false,
            errorMsg: this.props.errorMsg
        };
    },
    open: function (errorMsg) {
        this.setState({ showError: true, errorMsg: errorMsg });
        $(this.refs.errorAlertModal).openModal();
    },
    close: function () {
        this.setState({
            showError: false,
            errorMsg: ''
        });
        $(this.refs.errorAlertModal).closeModal();
    },
    render: function () {
        return (
            <div ref="errorAlertModal" className="modal">
                <div className="modal-content red darken-2 white-text">
                  <h4>Error</h4>
                      <p className="error-content">
                          <i className="medium material-icons">error</i>
                          <span className="error-msg">{this.state.errorMsg}</span>
                      </p>
                </div>
                <div className="modal-footer">
                  <a href="javascript:void(0)" className="modal-action modal-close waves-effect waves-light red darken-2 white-text btn-flat" onClick={this.close}><b>OK</b></a>
                </div>
            </div>
            );
    }
});


var ReportGetBtn = React.createClass({
    componentDidMount: function(){
        $(this.refs.getReportBtn).tooltip({ delay: 50});
    },
    handleClick: function () {
        var report_request = {
            api_token: this.props.apiToken,
            report_date: this.props.reportDate
        };
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/Report/GetLatest', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                this.props.receivedReportData(xhr.responseText);
            }
        }.bind(this);
        xhr.send(JSON.stringify(report_request));
    },
    render: function () {
        return (
            <div className="col s12">
                <a ref="getReportBtn" href="javascript:void(0)" className="btn-floating btn-large waves-effect waves-light blue darken-2" onClick={this.handleClick} data-position="left" data-tooltip="Get my latest activities">
                    <i className="material-icons">send</i>
                </a>
            </div>
            );
    }
});

var ReportRememberMe = React.createClass({
    getInitialState: function () {
        return {
            checked: this.props.rememberMe
        };
    },
    componentWillReceiveProps: function (checked) {
        if (checked.rememberMe) { this.setState({ checked: true }); }
    },
    saveApiToken: function (apiToken) {
        var api_token_data = { api_token: apiToken };
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/Report/RememberMe', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
           
        }.bind(this);
        xhr.send(JSON.stringify(api_token_data));
    },
    handleClick: function () {
        var hasAPIToken = (String(this.props.apiToken).length > 0) ? true : false;
        if (hasAPIToken) {
            if (!this.state.checked) {
                this.saveApiToken(this.props.apiToken);
            }
            this.setState({
                checked: (this.state.checked) ? false : true
            });

        }
        else if (!hasAPIToken)
        { this.props.onError(true, 'Please enter your pivotal tracker api token.'); }
    },
    render: function () {
        return (
            <div className="input-field col s6" onClick={this.handleClick}>
                <input ref="RememberMeChkBx" id="RememberMe" type="checkbox" checked={this.state.checked} />
                <label for="RememberMe">Remember Me.</label>
            </div>
            );
}
});


var ReportDatePicker = React.createClass({

    getInitialState: function () {
        return { reportDate: new Date().toDateString() };
    },
    componentDidMount: function () {
        this.reportDatePicker();
    },
    handleChangeDate: function (reportDate) {
        this.props.onUserChangeDate(reportDate);
    },
    reportDatePicker: function () {
        var thisComponent = this;
        $(this.refs.ActivityDate).pickadate({
            selectMonths: true,
            selectYears: 5,
            format: 'mm-dd-yyyy',
            onStart: function () {
                var selecteddate = this.get('value', 'mm-dd-yyyy');
                thisComponent.handleChangeDate(selecteddate);
            },
            onClose: function () {
                var selecteddate = this.get('value', 'mm-dd-yyyy');
                thisComponent.handleChangeDate(selecteddate);
            }
        });
    },
    render: function () {
        return (
             <div className="input-field col s12">
                <input ref="ActivityDate" type="date" className="ReportDatePicker" data-value={this.state.reportDate} />
             </div>
            );
    }

});

var ReportApiTokenInput = React.createClass({
    componentDidUpdate: function () {
        if (this.props.apiToken.length > 0) {
            $(this.refs.ApiTokenInput).focus();
        }
    },
    handleChange: function () {
        this.props.onUserInput($(this.refs.ApiTokenInput).val());
    },
    render: function () {
        return (
            <div className="input-field col s12">
                <input ref="ApiTokenInput" type="text" className="validate" value={this.props.apiToken} onChange={this.handleChange} />
                <label ref="ApiTokenLabel" for="api_token">PIVOTAL TRACKER API TOKEN</label>
            </div>
            );
    }
});

var ReportForm = React.createClass({
    getInitialState: function () {
        return {
            rememberMe: false,
            apiToken: '',
            reportDate: '',
            showError: false,
            errorMsg: '',
            reportdata: [],
        };
    },
    componentDidMount: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/Report/GetSavedToken', true);
        xhr.onload = function () {
            var saved_token = JSON.parse(xhr.responseText);
            var isSaved = (String(saved_token).length > 10) ? true : false;
            this.setState({
                rememberMe: isSaved,
                apiToken: saved_token
            });
        }.bind(this);
        xhr.send();

    },
    handleChangeText: function (apiToken) {
        this.setState({ apiToken: apiToken });
    },
    handleChangeDate: function (reportDate) {
        this.setState({ reportDate: reportDate });
    },
    handleReceivedData: function (reportdata) {
        this.props.receivedReportData(reportdata);
        $(this.refs.GetReportForm).hide();
    },
    handleError: function (showError, errorMsg) {
        if (showError) {
            this.refs.ErrorAlert.open(errorMsg);
        }
    },
    render: function () {
        var props = this.props;
        return (
            <div ref="GetReportForm" className="row">
                <div className="col s12 m8 l6 offset-m2 offset-l3">
                    <div className="getReportForm">
                        <div class="section">
                            <div className="row">
                                <div className="col s12">
                                    <p className="flow-text">Get my pivotal tracker activities</p>
                                </div>
                            </div>
                            <div className="row">
                                <ReportApiTokenInput apiToken={this.state.apiToken} onUserInput={this.handleChangeText} />
                            </div>
                            <div className="row">
                                <ReportDatePicker onUserChangeDate={this.handleChangeDate} />
                            </div>
                            <div className="row">
                                <ReportRememberMe rememberMe={this.state.rememberMe} apiToken={this.state.apiToken} onError={this.handleError} />
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <div className="row">
                                <div className="right">
                                    <ReportGetBtn apiToken={this.state.apiToken} reportDate={this.state.reportDate} receivedReportData={this.handleReceivedData} />
                                </div>
                            </div>
                        </div>
                         <ErrorAlert ref="ErrorAlert" showError={this.state.showError} errorMsg={this.state.errorMsg} />
                     </div>
                </div>
            </div>
            );
    }
});
