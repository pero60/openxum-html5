Yinsh.Status = function(markerNumber, turnList) {
    this.markerNumber = markerNumber;
    this.turnList = turnList;
}

Yinsh.Manager = function (engine, gui_player, other_player, status) {

// public methods
    this.play = function () {
        if (engine.phase() == Yinsh.Phase.PUT_RING) {
            engine.put_ring(gui.get_selected_coordinates(), engine.current_color());
        } else if (engine.phase() == Yinsh.Phase.PUT_MARKER) {
            engine.put_marker(gui.get_selected_coordinates(), engine.current_color());
        } else if (engine.phase() == Yinsh.Phase.MOVE_RING) {
            engine.move_ring(gui.get_selected_ring(), gui.get_selected_coordinates());
            gui.clear_selected_ring();
            if (engine.get_rows(engine.current_color()).length == 0) {
                engine.remove_no_row();
                if (engine.get_rows(engine.current_color()).length == 0) {
                    engine.remove_no_row();
                }
            }
        } else if (engine.phase() == Yinsh.Phase.REMOVE_ROWS_AFTER ||
            engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE) {
            engine.remove_row(engine.select_row(gui.get_selected_coordinates(),
                engine.current_color()), engine.current_color());
            gui.clear_selected_row();
        } else if (engine.phase() == Yinsh.Phase.REMOVE_RING_AFTER ||
            engine.phase() == Yinsh.Phase.REMOVE_RING_BEFORE) {
            engine.remove_ring(gui.get_selected_coordinates(), engine.current_color());
            if (engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE) {
                if (engine.get_rows(engine.current_color()).length == 0) {
                    engine.remove_no_row();
                }
            }
        }
        gui.draw();
        if (engine.current_color() != gui.color()) {
            play_other();
            gui.draw();
        }
        status.markerNumber.innerHTML = engine.available_marker_number();
        status.turnList.innerHTML = "";

        var turn_list = engine.turn_list();
        for (var i = 0; i < turn_list.length; ++i) {
            status.turnList.innerHTML += turn_list[i] + "<br />";
        }

        if (engine.is_finished()) {
            var popup = document.getElementById("popupWinner");

            popup.innerHTML = "<p>The game is finished. The winner is " +
                (engine.winner_is() == Yinsh.Color.BLACK ? "black" : "white") + "</p>";
            $( "#popupWinner").popup("open");
        }

    };

// private methods
    var play_other = function () {
        if (engine.phase() == Yinsh.Phase.PUT_RING) {
            other.put_ring();
        } else if (engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE) {
            other.remove_rows();
            other.remove_ring();
        } else if (engine.phase() == Yinsh.Phase.PUT_MARKER) {
            other.move_ring(other.put_marker());
            if (engine.get_rows(engine.current_color()).length == 0) {
                other.remove_no_row();
                if (engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE) {
                    if (engine.get_rows(engine.current_color()).length == 0) {
                        engine.remove_no_row();
                    }
                }
            } else {
                other.remove_rows();
                other.remove_ring();
            }
        }
    };

    var engine = engine;
    var gui = gui_player;
    var other = other_player;
    var status = status;

    status.markerNumber.innerHTML = engine.available_marker_number();
};
