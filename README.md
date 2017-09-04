[![Build Status](https://travis-ci.org/SOCR/Resampling-Randomization-Webapp.svg?branch=master)](https://travis-ci.org/SOCR/Resampling-Randomization-Webapp)
[![GitHub issues](https://img.shields.io/github/issues/SOCR/Resampling-Randomization-Webapp.svg)](https://github.com/SOCR/Resampling-Randomization-Webapp/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/SOCR/Resampling-Randomization-Webapp/.svg?style=social)](https://twitter.com/intent/tweet?text=Checkout%20UMich%20SOCR%20Resampling-Randomization-Webapp%20http://socr.umich.edu/HTML5/Resampling_Webapp/&url=%5Bobject%20Object%5D)

A modern and portable SOCR web-app that demonstrates the concepts of statistical analysis such as resampling, randomization and probabilistic simulation.

## Introduction ##
There is a plethora of online reading material regarding statistics. Learning through activities has been always present at SOCR. This tool was created keeping users at the center stage. The UI is made more intuitive and responsive than other online available tools.
The primary purpose of this application is for students to learn how to draw statistical inference using randomized initial data sets. This tool can often be used to research fairly large datasets. 
To start off, we need to get data into the webapp. Currently data can be imported into the web-app through the following ways:
- Simulation Data - There are set of preloaded experiments into experiments which can be used to generate data. For example, user can choose binomial experiment and simulate coin tosses to get an initial dataset lets say H,T,T,H,T,H,H,H,T  `(H=head, T=tail)`.
- User Data - There is a spreadsheet available where users can copy-paste tables of data. Or they can import data from SOCR data using URLs.

## Goal ##
The goal of this project is to design a new, modern and portable SOCR web-app that demonstrates the concepts of statistical resampling, randomization and probabilistic simulation, which is purely based on HTML5, CSS3 and JavaScript framework. The implementation of this project demands platform portability, computational efficiency, usability (complete functionality via user-friendly modern interface), extensibility and ease of documentation, support and servicing to the entire community.

- For more information regarding this project see [SOCR Wiki](http://wiki.stat.ucla.edu/socr/index.php/SOCR_Resampling_HTML5_Project)
- The application is currently hosted [at SOCR UCLA](http://socr.ucla.edu/htmls/HTML5/SOCR_Resampling_Webapp/) and [at SOCR UMich](http://socr.umich.edu/HTML5/Resampling_Webapp/). 


## Installation ##

- clone source code 
```
git clone git@github.com:SOCR/Resampling-Randomization-Webapp.git
```
- install node and npm ( if you have it already, skip this step).
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
nvm install 7.1.0
```
The above commands will install node v7.1.0 and use the corresponding npm v4.2.0	

- install grunt-cli  
```
npm install grunt-cli -g
```

- Start the server.
```
npm start
```
- Visit http://localhost:8000/

- To run test cases.
```
npm test
```

## Development and Contiribution 
We use MVC Model-View-Controller, to categorize the code into logical sections. The business logic resides in the model, in our case the calculation, manipulation, generation happens inside the model.
View prepares the look and feel of the UI components. Controller acts as the glue between view and controller.
- [App Structure](https://github.com/selvam1991/SOCR-Resampling-Randomization-Webapp/wiki)

Please contact any member of the SOCR team for any further questions or file an issue on github and tag members.
	
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
