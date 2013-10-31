<div data-role="content">
    <?php echo $this->Session->flash(); ?>

    <?php
    echo $this->Html->script('yinsh/Yinsh');
    echo $this->Html->script('yinsh/Constants');
    echo $this->Html->script('yinsh/Coordinates');
    echo $this->Html->script('yinsh/Engine');
    echo $this->Html->script('yinsh/GuiPlayer');
    echo $this->Html->script('yinsh/Intersection');
    echo $this->Html->script('yinsh/Manager');
    echo $this->Html->script('yinsh/RandomPlayer');
    ?>

    <script language="javascript">
        $(document).ready(function () {
            var canvas = document.getElementById("board");
            var canvas_div = document.getElementById("boardDiv");
            var markerNumber = document.getElementById("markerNumber");
            var turnList = document.getElementById("turnList");
            var engine = new Yinsh.Engine(Yinsh.GameType.BLITZ, Yinsh.Color.BLACK);
            var gui = new Yinsh.GuiPlayer(Yinsh.Color.BLACK, engine);
            var other = new Yinsh.RandomPlayer(Yinsh.Color.WHITE, engine);
            var manager = new Yinsh.Manager(engine, gui, other, new Yinsh.Status(markerNumber, turnList));

            if (canvas_div.clientHeight < canvas_div.clientWidth) {
                canvas.height = canvas_div.clientHeight * 0.95;
                canvas.width = canvas_div.clientHeight * 0.95;
            } else {
                canvas.height = canvas_div.clientWidth * 0.95;
                canvas.width = canvas_div.clientWidth * 0.95;
            }
            gui.set_canvas(canvas);
            gui.set_manager(manager);
        });
   </script>

    <div data-role="popup" id="popupWinner"></div>

    <section class="ui-grid-a" style="height: 500px">
        <div class="ui-block-a" style="width: 25%; height: 100%">
            <table style="width: 100%; height: 100%; table-layout: fixed; padding: 10px">
                <tr style="height: 50px">
                    <td>
                        <span id="markerNumber"></span>
                    </td>
                </tr>
                <tr style="vertical-align: top">
                    <td>
                        <span id="turnList" style="display:block; overflow: auto"></span>
                    </td>
                </tr>
            </table>
        </div>
        <div class="ui-block-b" style="padding: 10px; width: 70%; height: 100%" id="boardDiv">
            <canvas id="board"
                    style="padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block; border-radius: 15px; -moz-border-radius: 15px; box-shadow: 8px 8px 2px #aaa; ">
            </canvas>
        </div>
    </section>
</div>

<div data-role="footer" class="ui-bar"
     style="position: absolute; bottom: 0; width: 100%; margin-left:auto; margin-right:auto; align:center; text-align:center;">
    <div data-role="controlgroup" data-type="horizontal">
        <a href="#">New game</a>
        <a href="#">Rules</a>
    </div>
</div>
