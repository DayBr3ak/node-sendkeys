'use strict'

const {
  spawnPowershellScript,
  scriptFactory,
  argumentChecker
} = require('./sendKeys.factory.win')

describe('happy path', () => {
  it('spawns a powershell script', () => {
    const proc = spawnPowershellScript('[System.Console]::WriteLine("foobar")')
    return expect(proc).resolves.toBeUndefined()
  })

  it('spawns a powershell script and fails', () => {
    const script = '[System.Console]::foo("bar")' // doesn't exists
    const proc = spawnPowershellScript(script)
    return expect(proc).rejects.toContain(script)
  })

  const csSource1 = `
    public class StartUp {
      public static void Invoke(string str) {
        System.Console.WriteLine(str);
      }
    }`
  it('makes a script', () => {
    const script = scriptFactory(csSource1)
    const command = script('foo')
    expect(command).toContain(csSource1)
  })

  it('makes a script and spawns and succeed', () => {
    const script = scriptFactory(csSource1)
    const command = script('foo')
    const proc = spawnPowershellScript(command)
    return expect(proc).resolves.toBeUndefined()
  })

  it('should fail if the argument is not a string', () => {
    expect(() => argumentChecker('keys', 'string')).not.toThrow()
    expect(() => argumentChecker(10, 'string')).toThrowError(
      /Argument must be/i
    )
    expect(() => argumentChecker({ foo: 'bar' }, 'string')).toThrowError(
      /Argument must be/i
    )
  })
})
