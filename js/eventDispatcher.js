 // A generic observable subject class that is useful in model creation.
        //
        var LIB_makeSubject = function(events) {
            
            var groups = {};
            
            var addEvent = function(event) {
                if (groups.hasOwnProperty(event)) {
                    throw new Error('addEvent: Already an event named "'+event+'"');
                }
                groups[event] = [];
            };

            var addObserver = function(event, observer) {
                if (!groups.hasOwnProperty(event)) {
                    throw new Error('addObserver: No event "'+event+'".');
                }
                var group = groups[event];
                for (var i=0, ilen=group.length; i<ilen; i++) {
                    if (group[i] === observer) {
                        throw new Error('Cannot add the same listener more than once.');
                    }
                }
                group.push(observer);
            };
            
            var removeObserver = function(event, observer) {
                if (!groups.hasOwnProperty(event)) {
                    throw new Error('removeObserver: No event "'+event+'".');
                }
                var group = groups[event];
                for (var i=0, ilen=group.length; i<ilen; i++) {
                    if (group[i] === observer) {
                        group.splice(i, 1);
                        return;
                    }
                }
                throw new Error('removeObserver: Did not find the observer and so could not remove it.');
            };
            
            var notifyObservers = function(event, data) {
                if (!groups.hasOwnProperty(event)) {
                    throw new Error('notifyObservers: No event "'+event+'".');
                }
                var group = groups[event];
                for (var i=0, ilen=group.length; i<ilen; i++) {
                    group[i](data);
                }
            };
            
            // initialize
            for (var i=0, ilen=events.length; i<ilen; i++) {
                var event = events[i];
                addEvent(event);
            };
                        
            return {
                addEvent: addEvent,
                addObserver: addObserver,
                removeObserver: removeObserver,
                notifyObservers: notifyObservers
            };
        };
        