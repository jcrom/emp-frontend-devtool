{CompositeDisposable} = require 'atom'
emp = require './global/emp'
server = require './net/server'


module.exports =
class CodeEventEmitter

  # constructor:(@codeView, @oDebugServer) ->
  constructor:(@codeView) ->
    @disposable = new CompositeDisposable

  # doCodeEmit:(@CodeRunner) ->

    # @disposable.add @CodeRunner.onLogStdOut (e)=>
    #   @codeView.showMsg e.type, e.msg
    #
    # @disposable.add @CodeRunner.onLogStdErr (e)=>
    #   @codeView.showMsg e.type, e.msg
    #
    # @disposable.add @CodeRunner.onLogExit (e)=>
    #   @codeView.setOver e


  doManaEmit:(@luaDebugView) ->
    # @disposable.add @luaDebugView.onStart (e)=>
      # @codeView.show e
      # @codeView.toggle()
      # @CodeRunner.run_code()

    # @disposable.add @luaDebugView.onStop (e)=>
    #   @codeView.toggle()

    #socket server
    @disposable.add @luaDebugView.onStartServer (e)=>
      server.start e.host, e.port

    @disposable.add @luaDebugView.onStopServer (e)=>
      server.stop()


    @disposable.add @luaDebugView.onSendRun (e)=>
      server.send(emp.LUA_MSG_RUN)

    @disposable.add @luaDebugView.onSendStep (e)=>
      server.send(emp.LUA_MSG_STEP)

    @disposable.add @luaDebugView.onSendOver (e)=>
      server.send(emp.LUA_MSG_OVER)

    @disposable.add @luaDebugView.onSendDone (e)=>
      server.send(emp.LUA_MSG_DONE)

    @disposable.add @luaDebugView.onSendOut (e)=>
      server.send(emp.LUA_MSG_OUT)

    # use for test
    @disposable.add @luaDebugView.onSendMsg (sMsg)=>
      server.send(sMsg)

    @disposable.add @luaDebugView.onDelBPEvnent (bp)=>
      @oBreakpointStore.delBPCB(bp)
      server.delBPCB bp
      # @oDebugServer.send(emp.LUA_MSG_DONE)

    @disposable.add @luaDebugView.onSetSelectClient (sKey)=>
      server.setSelectClient sKey

    # @disposable.add @luaDebugView.onSendDone (e)=>
      # @oDebugServer.send(emp.LUA_MSG_DONE)

    @disposable.add server.onStarted (e)=>
      @luaDebugView.show_bar_panel()
    @disposable.add server.onStopped (e)=>
      @luaDebugView.hide_bar_panel()
    @disposable.add server.onGetAllBP (e)=>
      server.sendAllBPsCB(e, @oBreakpointStore.oBPMaps)
    @disposable.add server.onRTInfo (e) =>
      @oBreakpointStore.activeEditor(e.name, e.line)
      @luaDebugView.refresh_variable(e.name, e.variable)
    # @disposable.add server.onInitialRun (e) =>
    #   server.sendRun(e, @oBreakpointStore.oBPMaps)




  doBPEmit:(@oBreakpointStore) ->
    @disposable.add @oBreakpointStore.onAddBP (bp)=>
      @luaDebugView.addBPCB bp
      server.addBPCB bp

    @disposable.add @oBreakpointStore.onDelBP (bp)=>
      @luaDebugView.delBPCB bp
      server.delBPCB bp

  destroy: ->
    @dispose()

  dispose:->
    @disposable.dispose()
