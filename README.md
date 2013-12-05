# Angular Timepicker Directive

A simple dropdown style timepicker directive.

## Prerequisites

1. Angular 1.2.0+
2. Angular UI Bootstrap 0.3.0+ ($position service)
 
## Usage

Include the timepicker directive file, and attach it to an input field.

    <input type="text" dn-timepicker min-time="00:00" max-time="23:59" step="15m" ng-model="timepicker.model" />
    
## Options

#### ng-model (Date)

The model that the timepicker is bound to. If no model is given, it will create a new one.

    Default value: new Date()

<sub>Added: 1.0.0</sub>

#### min-time (string)

The lower limit for the list of selectable times.

    Default value: '00:00'

<sub>Added: 1.0.0</sub>

#### max-time (string)

The upper limit for the list of selectable time.

    Default value: '23:55'

<sub>Added: 1.0.0</sub>

#### step (string)

The amount of time between each item in the list of selectable time.

    Default value: '1h'

<sub>Added: 1.0.0</sub>
