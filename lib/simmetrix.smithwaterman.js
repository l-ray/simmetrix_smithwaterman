Simmetrix = {};
Simmetrix.SmithWaterman = {

	gapCost : Number(0.5),
    maxCost : Number(1.0),
    minCost : Number(-2.0),
 
    similarity:function ( string1, string2 ) {

        var fSmithWaterman = this._unNormalisedSmithWaterman(string1, string2);
        
        //normalise into zero to one region from min max possible
        var maxValue = Math.min(string1.length, string2.length);
        if (this.maxCost > -this.gapCost) {
        	maxValue *= this.maxCost;
        } else {
            maxValue *= -this.gapCost;
        }

        //check for 0 maxLen
        if (maxValue == 0) {
            return 1.0; //as both strings identically zero length
        } else {
            //return actual / possible NeedlemanWunch distance to get 0-1 range
            return (fSmithWaterman / maxValue);
        }
    },

    
     /**
     * get cost between characters where d(i,j) = 1 if i does not equal j, -2 if i equals j.
     *
     * @param str1         - the string1 to evaluate the cost
     * @param string1Index - the index within the string1 to test
     * @param str2         - the string2 to evaluate the cost
     * @param string2Index - the index within the string2 to test
     * @return  the cost of a given subsitution d(i,j) where d(i,j) = 1 if i!=j, -2 if i==j
     */
    getCost : function(str1, string1Index, str2,string2Index) {
        //check within range
        if (str1.length <= string1Index || string1Index < 0) {
            return 0;
        }
        if (str2.length <= string2Index || string2Index < 0) {
            return 0;
        }

        if (str1.charAt(string1Index) == str2.charAt(string2Index)) {
            return 1.0;
        } else {
            return -2.0;
        }
    },
    
    max3:function(x, y, z) {
        return Math.max(x, Math.max(y, z) );
    },
    
    max4:function(w, x, y, z) {
        return Math.max(Math.max(w, x), Math.max(y, z));
    },
    
    /**
     * implements the Smith-Waterman distance function
     * //see http://www.gen.tcd.ie/molevol/nwswat.html for details .
     *
     * @param s
     * @param t
     * @return the Smith-Waterman distance for the given strings
     */
    _unNormalisedSmithWaterman:function(s, t) {
        var n;
        var m;
        var i;
        var j;
        var cost;
        
        //final float[][] d; // matrix
        //final int n; // length of s
        //final int m; // length of t
        //int i; // iterates through s
        //int j; // iterates through t
        //float cost; // cost

        // check for zero length input
        n = s.length;
        m = t.length;
        if (n == 0) {
            return m;
        }
        if (m == 0) {
            return n;
        }

        //create matrix (n)x(m)
 		// d = new float[n][m];
        var d = new Array(n);
        for (var ki=0; ki < d.length; ki++) {
        	d[ki] = new Array(m);
        }
 
        //process first row and column first as no need to consider previous rows/columns
        var maxSoFar = 0.0;
        for (i = 0; i < n; i++) {
            // get the substution cost
            var cost = this.getCost(s, i, t, 0);

            if (i == 0) {
                d[0][0] = this.max3(0,
                		-this.gapCost,
                        cost);
            } else {
                d[i][0] = this.max3(0,
                        d[i - 1][0] - this.gapCost,
                        cost);
            }
            //update max possible if available
            if (d[i][0] > maxSoFar) {
                maxSoFar = d[i][0];
            }
        }
        for (j = 0; j < m; j++) {
            // get the substution cost
            cost = this.getCost(s, 0, t, j);

            if (j == 0) {
                d[0][0] = this.max3(0,
                        -this.gapCost,
                        cost);
            } else {
                d[0][j] = this.max3(0,
                        d[0][j - 1] - this.gapCost,
                        cost);
            }
            //update max possible if available
            if (d[0][j] > maxSoFar) {
                maxSoFar = d[0][j];
            }
        }

        // cycle through rest of table filling values from the lowest cost value of the three part cost function
        for (i = 1; i < n; i++) {
            for (j = 1; j < m; j++) {
                // get the substution cost
                cost = this.getCost(s, i, t, j);

                // find lowest cost at point from three possible
                d[i][j] = this.max4(0,
                        d[i - 1][j] - this.gapCost,
                        d[i][j - 1] - this.gapCost,
                        d[i - 1][j - 1] + cost);
                //update max possible if available
                if (d[i][j] > maxSoFar) {
                    maxSoFar = d[i][j];
                }
            }
        }

        // return max value within matrix as holds the maximum edit score
        return maxSoFar;
    }
};
