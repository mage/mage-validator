import * as assert from 'assert'
import { loadTopicsFromModule } from '../../src'

describe('loadTopicsFromModule', function () {
  it('Throws if the module does not exist', function () {
    const exports = {}
    loadTopicsFromModule(exports, 'moduleZero')
  })

  it('Does nothing if the module does not have a topics folder', function () {
    const exports = {}
    loadTopicsFromModule(exports, 'moduleOne')

    assert.deepStrictEqual(exports, {})
  })

  it('Does nothing if the module has an empty topics folder', function () {
    const exports = {}
    loadTopicsFromModule(exports, 'moduleTwo')

    assert.deepStrictEqual(exports, {})
  })

  it('Throws an error if a topic is already defined', async function () {
    const exports = {
      topicOne: class {
        /// topic class
      }
    }

    try {
      loadTopicsFromModule(exports, 'moduleThree')
    } catch (error) {
      return
    }

    throw new Error('topics loading should have failed')
  })

  it('Loads topics (and ignores JavaScript files)', function () {
    const exports = {}
    loadTopicsFromModule(exports, 'moduleThree')

    assert.deepStrictEqual(exports, {
      topicOne: require('../fixtures/lib/modules/moduleThree/topics/topicOne').default
    })
  })

  it('Default exports are assigned a class name', function () {
    const exports: any = {}
    loadTopicsFromModule(exports, 'moduleThree')

    assert.strictEqual(exports.topicOne.getClassName(), 'topicOne')
  })

  it('Explicit class names on default exports are preserved', function () {
    const exports: any = {}
    loadTopicsFromModule(exports, 'moduleFour')

    assert.strictEqual(exports.topicThree.getClassName(), 'CustomName')
  })
})
