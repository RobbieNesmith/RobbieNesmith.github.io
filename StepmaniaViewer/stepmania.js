function addParam(buf) {
	values[values.length - 1].push(buf);
}

function addValue() {
	values.push([]);
}

// Based on:
// https://github.com/stepmania/stepmania/blob/5_1-new/src/MsdFile.cpp#L32
function parseSimFile(buf) {
	var bUnescape = true;
	var len = buf.length;
	var readingValue = false;
	var i = 0;
	var cProcessed = [];
	var iProcessedLen = -1;
	while (i < len) {
		if (i + 1 < len && buf[i] == '/' && buf[i + 1] == '/') {
			/* Skip a comment entirely; don't copy the comment to the value/parameter */
			do {
				i++;
			} while (i < len && buf[i] != '\n');
			continue;
		}
		
		if (readingValue && buf[i] == '#') {
			/* Unfortunately, many of these files are missing ;'s.
			 * If we get a # when we thought we were inside a value, assume we
			 * missed the ;.  Back up and end the value. */
			// Make sure this # is the first non-whitespace character on the line.
			
			var firstChar = true;
			var j = iProcessedLen;
			while (j > 0 && cProcessed[j - 1] != '\r' && cProcessed[j - 1] != '\n') {
				if (cProcessed[j - 1] == ' ' || cProcessed[j - 1] == '\t') {
					--j;
					continue;
				}
				
				firstChar = false;
				break;
			}
			
			if (!FirstChar) {
				/* We're not the first char on a line.  Treat it as if it were a normal character. */
				cProcessed[iProcessedLen++] = buf[i++];
				continue;
			}
			
			/* Skip newlines and whitespace before adding the value. */
			iProcessedLen = j;
			while (iProcessedLen > 0 &&
					(cProcessed[iProcessedLen -1] == '\r' || cProcessed[iProcessedLen -1] == '\n'
					 || cProcessed[iProcessedLen -1] == ' ' || cProcessed[iProcessedLen -1] == '\t')) {
				--iProcessedLen;
			}
			addParam(cProcessed.slice(0, iProcessedLen).join("").trim());
			iProcessedLen = 0;
			readingValue = false;
		}
			
		/* # starts a new value. */
		if( !readingValue && buf[i] == '#' ) {
			addValue();
			readingValue = true;
		}

		if( !readingValue ) {
			if( bUnescape && buf[i] == '\\' ) {
				i += 2;
			} else {
				++i;
			}
			continue; /* nothing else is meaningful outside of a value */
		}
		
		/* : and ; end the current param, if any. */
		if(iProcessedLen != -1 && (buf[i] == ':' || buf[i] == ';') ) {
			addParam(cProcessed.slice(0, iProcessedLen).join("").trim());
		}
		
		/* # and : begin new params. */
		if( buf[i] == '#' || buf[i] == ':' ) {
			++i;
			iProcessedLen = 0;
			continue;
		}

		/* ; ends the current value. */
		if( buf[i] == ';' ) {
			readingValue = false;
			++i;
			continue;
		}

		/* We've gone through all the control characters.  All that is left is either an escaped character, 
		 * ie \#, \\, \:, etc., or a regular character. */
		if( bUnescape && i < len && buf[i] == '\\' ) {
			++i;
		}
		if( i < len ) {
			cProcessed[iProcessedLen++] = buf[i++];
		}
	}

	/* Add any unterminated value at the very end. */
	if( readingValue ) {
		addParam(cProcessed.slice(0, iProcessedLen).join("").trim());
	}
}
