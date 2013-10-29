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
    window.onload = function () {
        var canvas = document.getElementById("board");
        var markerNumber = document.getElementById("markerNumber");
        var turnList = document.getElementById("turnList");
        var engine = new Yinsh.Engine(Yinsh.GameType.BLITZ, Yinsh.Color.BLACK);
        var gui = new Yinsh.GuiPlayer(Yinsh.Color.BLACK, engine);
        var other = new Yinsh.RandomPlayer(Yinsh.Color.WHITE, engine);
        var manager = new Yinsh.Manager(engine, gui, other, new Yinsh.Status(markerNumber, turnList));

        gui.set_canvas(canvas);
        gui.set_manager(manager);
    };
</script>
<section class="ui-grid-a">
    <div class="ui-block-a" style="width: 25%; height: 600px">
        <table style="width: 100%; height: 100%; table-layout: fixed;">
            <tr style="height: 50px">
                <td style="width: 90px">Marker number</td>
                <td><span id="markerNumber"></span></td>
            </tr>
            <tr style="vertical-align: top">
                <td>Turn list</td>
                <td>
                    <span id="turnList" style="display:block; overflow: auto"></span>
                </td>
            </tr>
        </table>
    </div>
    <div class="ui-block-b">
        <canvas id="board" width="600" height="600">
        </canvas>
    </div>
</section>
