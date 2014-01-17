var smithWaterman = require('../lib/simmetrix.smithwaterman.js')
var expect = require('expect.js');

describe('Simmetrix.SmithWaterman', function(){
  describe('#similarity()', function(){
    it('should return a proper similarity between 0 and 1', function(){
      expect(smithWaterman.similarity("Test String1", "Test String2").toFixed(4)).to.be.equal('0.9167');
      expect(smithWaterman.similarity("hallo", "halli").toFixed(4)).to.be.equal('0.8000');
      expect(smithWaterman.similarity("hallo", "hallö").toFixed(4)).to.be.equal('0.8000');
      expect(smithWaterman.similarity("PUNSCHIGEL", "PUNSCHIGEL / STOP DANCING IF YOU CAN!!!").toFixed(4)).to.be.equal('1.0000');
    }),
    it('should return 0 with undefined or empty strings', function(){
      expect(smithWaterman.similarity("", "Test String2").toFixed(4)).to.be.equal('0.0000');
      expect(smithWaterman.similarity(undefined, "Test String2").toFixed(4)).to.be.equal('0.0000');
      expect(smithWaterman.similarity("Test String1", undefined).toFixed(4)).to.be.equal('0.0000');
    })
  })
})
