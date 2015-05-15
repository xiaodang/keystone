var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var AltText = require('./AltText');
var Toolbar = require('./Toolbar');

var FormInput = require('elemental').FormInput;
var FormIconField = require('elemental').FormIconField;
var InputGroup = require('elemental').InputGroup;
var Button = require('elemental').Button;

var Header = React.createClass({
	
	displayName: 'ItemViewHeader',
	
	getInitialState: function() {
		return {
			searchIsVisible: false,
			searchIsFocused: false,
			searchString: ''
		};
	},
	
	componentDidUpdate: function(prevProps, prevState) {
		if (this.state.searchIsVisible && !prevState.searchIsVisible) {
			this.refs.searchField.getDOMNode().focus();
		}
	},
	
	toggleCreate: function(visible) {
		this.props.toggleCreate(visible);
	},
	
	toggleSearch: function(visible) {
		this.setState({
			searchIsVisible: visible,
			searchIsFocused: visible,
			searchString: ''
		});
	},
	
	searchFocusChanged: function(focused) {
		this.setState({
			searchIsFocused: focused
		});
	},
	
	searchStringChanged: function(event) {
		this.setState({
			searchString: event.target.value
		});
	},
	
	renderDrilldown: function() {
		if (this.state.searchIsVisible) return null;
		/* eslint-disable no-script-url */
		return (
			<Toolbar.Section left>
				{this.renderDrilldownItems()}
				{this.renderSearch()}
			</Toolbar.Section>
		);
		/* eslint-enable */
	},
	
	renderDrilldownItems: function() {
		
		var list = this.props.list,
			items = this.props.drilldown.items;
		
		var els = items.map(function(dd) {
			
			var links = [];
			
			dd.items.forEach(function(el, i) {
				links.push(<a key={'dd' + i} href={el.href} title={dd.list.singular}>{el.label}</a>);
				if (i < dd.items.length - 1) {
					links.push(<span key={'ds' + i} className="separator">,</span>);//eslint-disable-line comma-spacing
				}
			});
			
			var more = dd.more ? <span>...</span> : '';
			
			return (
				<li>
					{links}
					{more}
				</li>
			);
			
		});

		if (!els.length) {
			return (
				<Button type="link" href={'/keystone/' + list.path}>
					<span className="octicon octicon-list-unordered" />
					{list.plural}
				</Button>
			);
		} else {
			return <ul className="item-breadcrumbs" key="drilldown">els</ul>;
		}
		
	},
	
	renderSearch: function() {
		var list = this.props.list;
		return (
			<form action={'/keystone/' + list.path} className="EditForm__header__search hidden-xs">
				<FormIconField iconPosition="left" iconColor="default" iconKey="search" className="EditForm__header__search-field">
					<FormInput
						ref="searchField"
						type="search"
						name="search"
						value={this.state.searchString}
						onChange={this.searchStringChanged}
						onFocus={this.searchFocusChanged.bind(this, true)}
						onBlur={this.searchFocusChanged.bind(this, false)}
						placeholder="Search"
						className="EditForm__header__search-input" />
				</FormIconField>
			</form>
		);
	},
	
	renderInfo: function() {
		return (
			<Toolbar.Section right>
				{this.renderCreateButton()}
			</Toolbar.Section>
		);
	},
	
	renderCreateButton: function() {
		if (this.props.list.nocreate) return null;
		/* eslint-disable no-script-url */
		return (
			<Button type="success" onClick={this.toggleCreate.bind(this, true)}>
				<span className="octicon octicon-plus" />
				New {this.props.list.singular}
			</Button>
		);
		/* eslint-enable */
	},
	
	render: function() {
		return (
			<Toolbar>
				{this.renderDrilldown()}
				{this.renderInfo()}
			</Toolbar>
		);
	}
	
});

module.exports = Header;
