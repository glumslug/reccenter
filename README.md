<h1>Rec Center React App</h1>

This is a social scheduling application for pickup basketball.

<h2>Vision</h2>
<p>It's hard to find time to do activities with friends. Everyone's busy, and coordinating via group chat is draining. That's why I created this app, which lets you see the days everyone is available, to take the hassle out of scheduling. Right now it's only for basketball, but in the future I envision expanding it to any activity imagineable.</p>

<h2>Stack</h2>
<ul>
  <li>MERN: React JS frontend, node JS and express for the backend, and MongoDB for the database.</li>
  <li>The styling is pure CSS via SASS. </li>
  <li>File storage is done via Multer and Amazon S3.</li>
  <li>The auth system uses React Context API and JSON Web Tokens (JWT) for validation.</li>
  <li>The notification system is built using socket.io for instant updates.</li>
  <li>The password reset is built using nodemailer and the Gmail API.</li>
</ul>

<h2>Functionality</h2>
<p>First, set your schedule. The "ball now" icon automatically appears when you're available at the current time.</p>
<img src="./public/demoPics/recc-ballnow.gif" width="50%" height="50%">
<p>Now, join a group to start coordinating. You can either search for a friend's group, or make your own. Say Jane has a group called Best Friends. John can search for that group and request to join:</p>
<img src="./public/demoPics/recc-search.png" width="50%" height="50%">
<img src="./public/demoPics/recc-request.png" width="50%" height="50%">
<img src="./public/demoPics/recc-groups.png" width="50%" height="50%">
<p>Next, Jane will get this request and can approve or deny it:</p>
<img src="./public/demoPics/recc-groups2.png" width="50%" height="50%">
<p>Alternately, John can make his own group and invite Jane. Jane will receive this invite:</p>
<img src="./public/demoPics/recc-manage.png" width="50%" height="50%">
<p>If she joins, her schedule will be added to the group's master schedule:</p>
<img src="./public/demoPics/recc-group1.png" width="50%" height="50%">
<p>She can view who's available on a given day by clicking the square for that day/time. The blue icon on the upper right indicates what type of game is available currently. Right now, they can only play 1s (1 on 1).</p>
<img src="./public/demoPics/recc-group2.png" width="50%" height="50%">

<h3>User System Features</h3>
<p>Basic functionality includes updating your account:</p>
<img src="./public/demoPics/recc-acct.png" width="50%" height="50%">

<p>There is also a friend system that functions exactly like the group system:</p>
<img src="./public/demoPics/recc-friend1.png" width="50%" height="50%">
<img src="./public/demoPics/recc-friend-manage.png" width="50%" height="50%">

<h3>Notifications</h3>
<p>Notifications show up on the menu, and hover over the relevant area:</p>
<img src="./public/demoPics/recc-menu.png" width="50%" height="50%">

<p>Notifications are instant thanks to socket.io </p>
<img src="./public/demoPics/recc-notif.gif" width="50%" height="50%">
