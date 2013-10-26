// namespace Yinsh
var Yinsh = {

    begin_letter: [ 'B', 'A', 'A', 'A', 'A', 'B', 'B', 'C',
        'D', 'E', 'G' ],
    end_letter: [ 'E', 'G', 'H', 'I', 'J', 'J', 'K', 'K', 'K',
        'K', 'J' ],
    begin_number: [ 2, 1, 1, 1, 1, 2, 2, 3, 4, 5, 7 ],
    end_number: [ 5, 7, 8, 9, 10, 10, 11, 11, 11, 11, 10 ],
    begin_diagonal_letter: [ 'B', 'A', 'A', 'A', 'A', 'B',
        'B', 'C', 'D', 'E', 'G'],
    end_diagonal_letter: [ 'E', 'G', 'H', 'I', 'J', 'J',
        'K', 'K', 'K', 'K', 'J' ],
    begin_diagonal_number: [ 7, 5, 4, 3, 2, 2, 1, 1, 1, 1, 2 ],
    end_diagonal_number: [ 10, 11, 11, 11, 11, 10, 10, 9, 8,
        7, 5 ],

    Board: {

    },

    GUI: {
        Board: function (canvas, context) {
            // this.canvas = canvas;
            this.context = context;
            this.delta_x = 0;
            this.delta_y = 0;
            this.delta_xy = 0;
            this.offset = 0;
            this.height = canvas.height;
            this.width = canvas.width;
        },

        compute_deltas: function (board) {
            board.offset = 30;
            board.delta_x = (board.width - 2 * board.offset) / 10.;
            // board.delta_y = board.delta_x;
            board.delta_xy = board.delta_y / 2;
        },

        compute_coordinates: function (board, letter, number) {
            var index_x = letter - 'A'.charCodeAt(0);
            var x = board.offset + board.delta_x * index_x;
            var y = board.offset + 7 * board.delta_y + board.delta_xy * index_x -
                (number - 1) * board.delta_y;

            return [x, y];
        },

        draw_coordinates: function (board) {
            var pt;

            board.context.fillStyle = "#000000";
            board.context.font = "16px _sans";
            board.context.textBaseline = "top";

            // letters
            for (var l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
                pt = Yinsh.GUI.compute_coordinates(board, l, Yinsh.begin_number[l - 'A'.charCodeAt(0)]);
                pt[0] -= 5;
                pt[1] += 20;

                board.context.fillText(String.fromCharCode(l), pt[0], pt[1]);
            }

            // numbers
            board.context.textBaseline = "bottom";
            for (var n = 1; n < 12; ++n) {
                pt = Yinsh.GUI.compute_coordinates(board, Yinsh.begin_letter[n - 1].charCodeAt(0), n);
                pt[0] -= 15 + (n > 9 ? 5 : 0);
                pt[1] -= 3;

                board.context.fillText(n.toString(), pt[0], pt[1]);
            }
            board.context.stroke();
        },

        draw_grid: function (board) {
            var _pt_begin;
            var _pt_end;

            for (var l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
                var index = l - 'A'.charCodeAt(0);

                _pt_begin = Yinsh.GUI.compute_coordinates(board, l, Yinsh.begin_number[index]);
                _pt_end = Yinsh.GUI.compute_coordinates(board, l, Yinsh.end_number[index]);
                board.context.moveTo(_pt_begin[0], _pt_begin[1]);
                board.context.lineTo(_pt_end[0], _pt_end[1]);
            }
            for (var n = 1; n < 12; ++n) {
                _pt_begin = Yinsh.GUI.compute_coordinates(board, Yinsh.begin_letter[n - 1].charCodeAt(0), n);
                _pt_end = Yinsh.GUI.compute_coordinates(board, Yinsh.end_letter[n - 1].charCodeAt(0), n);
                board.context.moveTo(_pt_begin[0], _pt_begin[1]);
                board.context.lineTo(_pt_end[0], _pt_end[1]);
            }

            for (var i = 0; i < 11; ++i) {
                _pt_begin = Yinsh.GUI.compute_coordinates(board, Yinsh.begin_diagonal_letter[i].charCodeAt(0),
                    Yinsh.begin_diagonal_number[i]);
                _pt_end = Yinsh.GUI.compute_coordinates(board, Yinsh.end_diagonal_letter[i].charCodeAt(0),
                    Yinsh.end_diagonal_number[i]);
                board.context.moveTo(_pt_begin[0], _pt_begin[1]);
                board.context.lineTo(_pt_end[0], _pt_end[1]);
            }
            board.context.stroke();
        },

        draw: function (canvas, context) {
            var board = new Yinsh.GUI.Board(canvas, context);
            Yinsh.GUI.compute_deltas(board);

            context.lineWidth = 1.;

            // background
            context.rect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'rgb(255, 255, 255)';
            context.fill();
            context.stroke();

            Yinsh.GUI.draw_grid(board);
            Yinsh.GUI.draw_coordinates(board);
        }
    }

}; // namespace Yinsh