<h1>HereThereEverywhereJS</h1> [![Build Status](https://travis-ci.org/JoeChapman/HereThereEverywhereJS.png)](https://travis-ci.org/JoeChapman/HereThereEverywhereJS)
==============

<small>Cute title, eh?!</small>

<h2>HereThereEverywhere is an observer with a difference.</h2>

<p>Ever get tired of tracing the source of your events subscription, not confident you know where an events is being published?</p>

<p>Get ready to have your socks blown off!</p>

<p>No really, sometimes when you're building a big app it's easy to lose track of your events, before you know it you're in event hell!</p>

<p>Well, with this piffy little library, you can declare all your events in one place, perhaps in your glue code, a bootstrap script or anywhere you fancy.</p>

<p>Simply tell it what object you expect to trigger what event and which object should respond with what event.</p>

<pre>
	<code>mediator.from(mockSource, 'eventName').to(mockTarget, 'eventName');</code>
</pre>

<h2>Contribute</h2>

<p>If you want to contribute, please take a fork, clone it and start hacking, however, I won't accept pull requests without <em>green</em> tests.</p>

<aside>
	<p>You'll need to download node, and run <code>npm install</code> to get the project dependencies</p>
	<p>And before running <code>npm install</code>, however, install grunt-cli, instructions here: <a href="">Grunt</a></p>
</aside>

<h3>Running tests and other Grunt tasks</h3>
<p>The default grunt task <code>grunt</code> will run jshint, run the headless jasmine tests with PhantomJS and build a compiled version.</p>
<p>For dev purposes, it should be enough for you to just run <code>grunt lint</code> and <code>grunt test</code>




