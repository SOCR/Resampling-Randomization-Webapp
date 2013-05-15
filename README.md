
A modern and portable SOCR web-app that demonstrates the concepts of statistical analysis such as resampling, randomization and probabilistic simulation.

## Introduction ##
There is a plethora of online reading material regarding statistics. Learning through activities has been always present at SOCR.This tool was created keeping users at the center stage. The UI is made more intuitive and responsive than other online available tools.
The primary purpose of this application is for students to learn how to draw statistical inference using randomized initial data sets. This tool can often be used to research fairly large datasets. 
To start off, we need to get data into the webapp.Currently data can be imported into the web-app through the following ways:
- Simulation Data - There are set of preloaded experiments into experiments which can be used to generate data. For example, user can choose binomial experiment and simulate coin tosses to get an initial dataset lets say H,T,T,H,T,H,H,H,T  `(H=head, T=tail)`.
- User Data - There is a spreadsheet available where users can copy-paste tables of data. Or they can import data from SOCR data using URLs.

## Goal ##
The goal of this project is to design a new, modern and portable SOCR web-app that demonstrates the concepts of statistical resampling, randomization and probabilistic simulation, which is purely based on HTML5, CSS3 and JavaScript framework. The implementation of this project demands platform portability, computational efficiency, usability (complete functionality via user-friendly modern interface), extensibility and ease of documentation, support and servicing to the entire community.

- For more information regarding this project see [SOCR Wiki](http://wiki.stat.ucla.edu/socr/index.php/SOCR_Resampling_HTML5_Project)
- The application is currently hosted [Here](http://socr.ucla.edu/htmls/HTML5/SOCR_Resampling_Webapp/) . Go ahead and give it a try. The application is optimized for mobile view. Please forword your feedbacks to @selvam1991

##Installation##
### Local
The application needs to be hosted in a server. 
If you want to run it locally in your machine, just extract the source code from git and place it in the www folder of wamp OR you can use any other apache server.
Incase of deploying it to a hosted server, just pull all the code into the server and run the index.html. For example, If I need to host the application at www.mydomain.com/app , then place the code in the app/ folder in the server and you are good to go!

### Cloud (using nodejitsu

Create an account in [nodejitsu](nodejitsu.com). There is a 30 day trail version available.
Clone the repo to your machine and edit the package.json file(optional) according to your own preferences.
From your terminal, run:

	jitsu login

You will be prompted to enter your nodejitsu login credentials.
Navigate to the folder where you have cloned the repo. And run :

	jitsu deploy

Nodejitsu will deploy the application to the cloud using the package.json configuration file. The application needs a start script. In our case, its server.js which creates the node server. This detail is already present in the package.json.
You will find the deployed url printed on the console itself and also in your nodejitsu account page.

## Development 
We decided to use the most widely used software design pattern; MVC. Model-View-Controller categorizes the code into logical sections. The business logic resides in the model, in our case the calculation, manipulation, generation happens inside the model.
View prepares the look and feel of the UI components. Controller acts as the glue between view and controller.
- [App Structure](https://github.com/selvam1991/SOCR-Resampling-Randomization-Webapp/wiki)

## Technologies 

The frontend of application has heavy usage of Twitter Bootstap v2.2. The backend JS code is primarily vanilla with certain specific libraries to augument the functionality of the app.
* [head.js](http://headjs.com/)
* [JQuery](http://jquery.com)
* [D3.js](http://d3js.org)
	
### Copyright and License 

**The LGPL License**

Copyright (c) 2012 Statistics Online Computational Resource (SOCR) &lt;http://www.StatisticsResource.org&gt;

All SOCR programs, materials, tools and resources are developed by and freely disseminated to the entire community.

Users may revise, extend, redistribute, modify under the terms of the Lesser GNU General Public License
as published by the Open Source Initiative http://opensource.org/licenses/. All efforts should be made to develop and distribute
factually correct, useful, portable and extensible resource all available in all digital formats for free over the Internet.

SOCR resources are distributed in the hope that they will be useful, but without
any warranty; without any explicit, implicit or implied warranty for merchantability or
fitness for a particular purpose. See the GNU Lesser General Public License for
more details see http://opensource.org/licenses/lgpl-license.php.
