var ReportDetails = React.createClass({
    getInitialState: function () {
        return { reportdata: this.props.children };
    },
    componentWillReceiveProps: function (propContent) {
        var ReportJSON = JSON.parse(propContent.reportdata);
        var ReportContent = (ReportJSON.length === 0)
            ? <p className="center">Sorry, no activities found for submitted date.</p>
            : ReportJSON;
        this.generateHtml(ReportContent);
    },
    generateHtml: function (activitiesData) {
        try {
            var ActivitesHtml = activitiesData.map(function (activity) {
                return (
                    <div key={activity.comment_id}>
                        <p><b>{activity.project}</b> - {activity.story} [# {activity.story_id}]</p>
                        <div dangerouslySetInnerHTML={{ __html: activity.comments.toString() }}>
                        </div>
                        <p> Activity Link : <a href={activity.story_url}>{activity.story_url}</a></p>
                        <hr />
                    </div>
                 );
            });
            this.setState({ reportdata: ActivitesHtml });
        }
        catch (e) {
            this.setState({ reportdata: activitiesData });
        }
    },
    render: function () {
        return (
                <div id="ReportContent">
                    {this.state.reportdata}
                </div>
                );
    }
});
var PreLoader = React.createClass({
    render: function () {
        return (
            <div ref="reportPreLoader" className="valign-wrapper report-preloader">
                    <div className="valign center">
                        <div className="preloader-wrapper big active">
                            <div className="spinner-layer spinner-blue-only">
                                <div className="circle-clipper left">
                                    <div className="circle"></div>
                                </div><div className="gap-patch">
                                    <div className="circle"></div>
                                </div>
                                <div className="circle-clipper right">
                                    <div className="circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            );
    }
});

var ReportContent = React.createClass({
    getInitialState: function () {
        return {
            title: 'Pivotal Tracker Report',
            reportdata: []
        };
    },
    componentWillReceiveProps: function (receiveddata) {
        this.setState({ reportdata: receiveddata.reportdata });
        $(this.refs.reportContent).show();
    },
    componentDidMount: function () {
        var clipboard = new Clipboard(this.refs.CopyToClipboardBtn);
        clipboard.on('success', function (e) {
            Materialize.toast('copied!', 4000);
            e.clearSelection();
        });
        $(this.refs.MoreOptionsBtn).dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false,
            hover: true,
            gutter: 0,
            belowOrigin: true,
            alignment: 'left'
        });
        $(this.refs.reportContent).hide();
    },
    render: function () {
        return (
                <div ref="reportContent" className="row">
                    <div className="col s12 m8 l8 offset-m2 offset-l2">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <div className="card-title report-content-header">
                                   <span className="flow-text"> {this.state.title}</span>
                                    <a href="javascript:void(0)" >
                                        <i ref="MoreOptionsBtn" className="material-icons right" data-activates='moreOptions' >more_vert</i>
                                    </a>
                                    <ul id="moreOptions" className="dropdown-content">
                                        <li><a ref="NavigateBackBtn" href="/"> Go back</a></li>
                                        <li><a ref="CopyToClipboardBtn" data-clipboard-target="#ReportContent">Copy to clipboard</a></li>
                                   </ul>
                                </div>
                                <div className="report-content">
                                    <ReportDetails reportdata={this.state.reportdata}>
                                        <div><PreLoader /></div>
                                    </ReportDetails>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
    }
});

var ActivitiesReportApp = React.createClass({
    getInitialState: function () {
        return {
            reportdata: []
        };
    },
    handleReportData: function (reportdata) {
        this.setState({ reportdata: reportdata });
    },
    render: function () {
        return (
            <div>
                <ReportForm receivedReportData={this.handleReportData} />
                <ReportContent reportdata={this.state.reportdata} />
            </div>
            );
    }
});

ReactDOM.render(<ActivitiesReportApp />, document.getElementById('PTReportApp'));