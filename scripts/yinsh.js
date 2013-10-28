// namespace Yinsh
var Yinsh = {

// grid constants definition
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

// enums definition
    GameType: { BLITZ: 0, REGULAR: 1 },
    Color: { BLACK: 0, WHITE: 1, NONE: 2 },
    Phase: { PUT_RING: 0, PUT_MARKER: 1, MOVE_RING: 2, REMOVE_ROWS_AFTER: 3,
        REMOVE_RING_AFTER: 4, REMOVE_ROWS_BEFORE: 5, REMOVE_RING_BEFORE: 6, FINISH: 7 },
    State: { VACANT: 0, BLACK_MARKER: 1, WHITE_MARKER: 2, BLACK_RING: 3, WHITE_RING: 4,
        BLACK_MARKER_RING: 5, WHITE_MARKER_RING: 6 },

// classes
    Coordinates: function (l, n) {
// public methods
        this.distance = function (coordinates) {
            if (coordinates.letter() == letter) {
                return coordinates.number() - number;
            } else {
                return coordinates.letter().charCodeAt(0) - letter.charCodeAt(0);
            }
        };

        this.hash = function () {
            return (letter.charCodeAt(0) - 'A'.charCodeAt(0)) + (number - 1) * 11;
        };

        this.is_valid = function () {
            return letter >= 'A' && letter <= 'K' && number >= 1 && number <= 11;
        }

        this.letter = function () {
            return letter;
        }

        this.number = function () {
            return number;
        }

// private attributes
        var letter = l;
        var number = n;
    },

    Intersection: function (c) {
// public methods
        this.hash = function () {
            return coordinates.hash();
        };

        this.color = function () {
            if (state == Yinsh.State.VACANT) {
                return -1;
            }

            if (state == Yinsh.State.BLACK_RING ||
                state == Yinsh.State.BLACK_MARKER ||
                state == Yinsh.State.BLACK_MARKER_RING) {
                return Yinsh.Color.BLACK;
            } else {
                return Yinsh.Color.WHITE;
            }
        };

        this.flip = function () {
            if (state == Yinsh.State.BLACK_MARKER) {
                state = Yinsh.State.WHITE_MARKER;
            } else if (state == Yinsh.State.WHITE_MARKER) {
                state = Yinsh.State.BLACK_MARKER;
            }
        };

        this.coordinates = function () {
            return coordinates;
        };

        this.letter = function () {
            return coordinates.letter();
        };

        this.number = function () {
            return coordinates.number();
        };

        this.put_marker = function (color) {
            if (color == Yinsh.Color.BLACK) {
                if (state == Yinsh.State.BLACK_RING) {
                    state = Yinsh.State.BLACK_MARKER_RING;
                }
            } else {
                if (state == Yinsh.State.WHITE_RING) {
                    state = Yinsh.State.WHITE_MARKER_RING;
                }
            }
        };

        this.put_ring = function (color) {
            if (color == Yinsh.Color.BLACK) {
                state = Yinsh.State.BLACK_RING;
            } else {
                state = Yinsh.State.WHITE_RING;
            }
        };

        this.remove_marker = function () {
            state = Yinsh.State.VACANT;
        };

        this.remove_ring = function () {
            if (state == Yinsh.State.BLACK_MARKER_RING || state == Yinsh.State.WHITE_MARKER_RING) {
                if (state == Yinsh.State.BLACK_MARKER_RING) {
                    state = Yinsh.State.BLACK_MARKER;
                } else {
                    state = Yinsh.State.WHITE_MARKER;
                }
            }
        };

        this.remove_ring_board = function () {
            state = Yinsh.State.VACANT;
        };

        this.state = function () {
            return state;
        };

// private attributes
        var coordinates = c;
        var state = Yinsh.State.VACANT;
    },

// ************
// Engine class

    Engine: function (type, color) {

// public methods
        this.available_marker_number = function () {
            return marker_number;
        };

        this.current_color = function () {
            return current_color;
        };

        this.exist_intersection = function (letter, number) {
            var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

            return coordinates in intersections;
        };

        this.get_free_intersections = function () {
            var list = [];

            for (var i = 0; i < letters.length; ++i) {
                var l = letters[i];

                for (var n = Yinsh.begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)];
                     n <= Yinsh.end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; ++n) {
                    var coordinates = new Yinsh.Coordinates(l, n);

                    if (intersections[coordinates.hash()].state() == Yinsh.State.VACANT) {
                        list.push(coordinates);
                    }
                }
            }
            return list;
        };

        this.get_placed_ring_coordinates = function (color) {
            return (color == Yinsh.Color.BLACK) ? placed_black_ring_coordinates :
                placed_white_ring_coordinates;
        };

        this.get_possible_moving_list = function (origin, color, control) {
            var list = new Array();

            if (!origin.hash() in intersections) {
                return list;
            }

            if (control && !((intersections[origin.hash()].state() == Yinsh.State.BLACK_MARKER_RING &&
                color == Yinsh.Color.BLACK) ||
                (intersections[origin.hash()].state() == Yinsh.State.WHITE_MARKER_RING &&
                    color == Yinsh.Color.WHITE))) {
                return list;
            }

            var state = {
                ok: true,
                no_vacant: false
            };
            var letter = intersections[origin.hash()].letter();
            var letter_index = intersections[origin.hash()].letter().charCodeAt(0) - 'A'.charCodeAt(0);
            var number = intersections[origin.hash()].number();
            var n;
            var l;

            // letter + number increase
            {
                n = number + 1;
                state.ok = true;
                state.no_vacant = false;
                while (n <= Yinsh.end_number[letter.charCodeAt(0) - 'A'.charCodeAt(0)] && state.ok) {
                    state = verify_intersection(letter, n, state);
                    if ((state.ok && !state.no_vacant) || (!state.ok && state.no_vacant)) {
                        list.push(get_intersection(letter, n));
                    }
                    ++n;
                }
            }
            // letter + number decrease
            {
                n = number - 1;
                state.ok = true;
                state.no_vacant = false;
                while (n >= Yinsh.begin_number[letter.charCodeAt(0) - 'A'.charCodeAt(0)] && state.ok) {
                    state = verify_intersection(letter, n, state);
                    if ((state.ok && !state.no_vacant) || (!state.ok && state.no_vacant)) {
                        list.push(get_intersection(letter, n));
                    }
                    --n;
                }
            }
            // number + letter increase
            {
                l = letter_index + 1;
                state.ok = true;
                state.no_vacant = false;
                while (l <= (Yinsh.end_letter[number - 1].charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                    state = verify_intersection(letters[l], number, state);
                    if ((state.ok && !state.no_vacant) || (!state.ok && state.no_vacant)) {
                        list.push(get_intersection(letters[l], number));
                    }
                    ++l;
                }
            }
            // number + letter decrease
            {
                l = letter_index - 1;
                state.ok = true;
                state.no_vacant = false;
                while (l >= (Yinsh.begin_letter[number - 1].charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                    state = verify_intersection(letters[l], number, state);
                    if ((state.ok && !state.no_vacant) || (!state.ok && state.no_vacant)) {
                        list.push(get_intersection(letters[l], number));
                    }
                    --l;
                }
            }
            // number increase + letter increase
            {
                n = number + 1;
                l = letter_index + 1;
                state.ok = true;
                state.no_vacant = false;
                while (n <= Yinsh.end_number[l] &&
                    l <= (Yinsh.end_letter[n - 1].charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                    state = verify_intersection(letters[l], n, state);
                    if ((state.ok && !state.no_vacant) || (!state.ok && state.no_vacant)) {
                        list.push(get_intersection(letters[l], n));
                    }
                    ++l;
                    ++n;
                }
            }
            // number decrease + letter decrease
            {
                n = number - 1;
                l = letter_index - 1;
                state.ok = true;
                state.no_vacant = false;
                while (n >= Yinsh.begin_number[l] &&
                    l >= (Yinsh.begin_letter[n - 1].charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                    state = verify_intersection(letters[l], n, state);
                    if ((state.ok && !state.no_vacant) || (!state.ok && state.no_vacant)) {
                        list.push(get_intersection(letters[l], n));
                    }
                    --l;
                    --n;
                }
            }
            return list;
        };

        this.get_rows = function (color) {
            var state = (color == Yinsh.Color.BLACK) ? Yinsh.State.BLACK_MARKER : Yinsh.State.WHITE_MARKER;
            var result = {
                start: false,
                row: [],
                rows: []
            };
            var n;
            var l;

            for (n = 1; n <= 11; ++n) {
                result.start = false;
                result.row = [];
                for (l = Yinsh.begin_letter[n - 1].charCodeAt(0); l <= Yinsh.end_letter[n - 1].charCodeAt(0); ++l) {
                    result = build_row(letters[l - 'A'.charCodeAt(0)], n, state, result);
                }
                if (result.row.length >= 5) {
                    result.rows.push(result.row);
                }
            }

            for (l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
                result.start = false;
                result.row = [];
                for (n = Yinsh.begin_number[l - 'A'.charCodeAt(0)]; n <= Yinsh.end_number[l - 'A'.charCodeAt(0)]; ++n) {
                    result = build_row(letters[l - 'A'.charCodeAt(0)], n, state, result);
                }
                if (result.row.length >= 5) {
                    result.rows.push(result.row);
                }
            }

            for (var i = 0; i < 11; ++i) {
                n = Yinsh.begin_diagonal_number[i];
                l = Yinsh.begin_diagonal_letter[i].charCodeAt(0);
                result.start = false;
                result.row = [];
                while (l <= Yinsh.end_diagonal_letter[i].charCodeAt(0) &&
                    n <= Yinsh.end_diagonal_number[i]) {
                    result = build_row(letters[l - 'A'.charCodeAt(0)], n, state, result);
                    ++l;
                    ++n;
                }
                if (result.row.length >= 5) {
                    result.rows.push(result.row);
                }
            }

            /*            var srows = [];

             if (!result.rows.empty()) {
             var list = [];

             list.push(result.rows.back());
             srows.push(list);
             result.rows.pop();
             while (!rows.empty()) {
             var row = rows.back();
             var found = false;
             SeparatedRows::iterator it = srows.begin();

             while (it != srows.end() and not found) {
             Rows::const_iterator itr = it->begin();

             while (itr != it->end() and not found) {
             if (not row.is_separated(*itr)) {
             it->push_back(row);
             found = true;
             } else {
             ++itr;
             }
             }
             ++it;
             }
             if (not found) {
             Rows list;

             list.push_back(row);
             srows.push_back(list);
             }
             rows.pop_back();
             }
             }
             return srows; */

            return result.rows;
        };

        this.intersection_state = function (letter, number) {
            return get_intersection(letter, number).state();
        };

        this.intersections = function () {
            return intersections;
        };

        this.is_blitz = function () {
            return this.type == Yinsh.Engine.GameType.BLITZ;
        };

        this.is_finished = function () {
            if (type == Yinsh.GameType.BLITZ) {
                return removed_black_ring_number == 1 || removed_white_ring_number == 1 || marker_number == 0;
            } else { // type = REGULAR
                return removed_black_ring_number == 3 || removed_white_ring_number == 3 || marker_number == 0;
            }
        };

        this.is_initialized = function () {
            return placed_black_ring_coordinates.length == 5 &&
                placed_white_ring_coordinates.length == 5;
        };

        this.is_regular = function () {
            return this.type == Yinsh.Engine.GameType.REGULAR;
        };

        this.move_ring = function (origin, destination) {
            if (!origin.hash() in intersections) {
                return false;
            }
            if (!destination.hash() in intersections) {
                return false;
            }
            if (intersections[destination.hash()].state() != Yinsh.State.VACANT) {
                return false;
            }
            if (!this.verify_moving(origin, destination)) {
                return false;
            }

            var intersection_origin = intersections[origin.hash()];
            var intersection_destination = intersections[destination.hash()];
            var color = intersection_origin.color();

            intersection_origin.remove_ring();
            intersection_destination.put_ring(color);
            flip_row(origin, destination);

            if (color == Yinsh.Color.BLACK) {
                remove_black_ring(origin);
                placed_black_ring_coordinates.push(destination);
            } else {
                remove_white_ring(origin);
                placed_white_ring_coordinates.push(destination);
            }
            phase = Yinsh.Phase.REMOVE_ROWS_AFTER;
            return true;
        };

        this.phase = function () {
            return phase;
        };

        this.put_marker = function (coordinates, color) {
            if (marker_number > 0) {
                if (coordinates.hash() in intersections) {
                    intersections[coordinates.hash()].put_marker(color);
                } else {
                    return false;
                }
                --marker_number;
            } else {
                return false;
            }
            phase = Yinsh.Phase.MOVE_RING;
            return true;
        };

        this.put_ring = function (coordinates, color) {
            if (color != current_color) {
                return false;
            }
            if ((color == Yinsh.Color.BLACK && placed_black_ring_coordinates.length == 5) ||
                (color == Yinsh.Color.WHITE && placed_white_ring_coordinates.length == 5)) {
                return false;
            }

            if (coordinates.hash() in intersections) {
                intersections[coordinates.hash()].put_ring(color);
            } else {
                return false;
            }
            if (color == Yinsh.Color.WHITE) {
                placed_white_ring_coordinates.push(coordinates);
            } else {
                placed_black_ring_coordinates.push(coordinates);
            }
            if (placed_black_ring_coordinates.length == 5 &&
                placed_white_ring_coordinates.length == 5) {
                phase = Yinsh.Phase.PUT_MARKER;
            }
            change_color();
            return true;
        };

        this.remove_no_row = function () {
            if (phase == Yinsh.Phase.REMOVE_ROWS_AFTER) {
                change_color();
                phase = Yinsh.Phase.REMOVE_ROWS_BEFORE;
            } else {
                phase = Yinsh.Phase.PUT_MARKER;
            }
        };

        this.remove_row = function (row, color) {
            //TODO: multiple rows !
            if (row.length != 5) {
                return false;
            }
            for (var j = 0; j < row.length; ++j) {
                remove_marker(row[j].letter(), row[j].number());
            }
            if (phase == Yinsh.Phase.REMOVE_ROWS_AFTER) {
                phase = Yinsh.Phase.REMOVE_RING_AFTER;
            } else {
                phase = Yinsh.Phase.REMOVE_RING_BEFORE;
            }
            return true;
        };

        this.remove_ring = function (coordinates, color) {
            var intersection = intersections[coordinates.hash()];

            if (intersection.color() == color) {
                intersection.remove_ring_board();
            } else {
                return false;
            }

            if (color == Yinsh.Color.BLACK) {
                remove_black_ring(coordinates);
                ++removed_black_ring_number;
            } else {
                remove_white_ring(coordinates);
                ++removed_white_ring_number;
            }
            if (this.is_finished()) {
                phase = Yinsh.Phase.FINISH;
            } else {
                if (phase == Yinsh.Phase.REMOVE_RING_AFTER) {
                    phase = Yinsh.Phase.REMOVE_ROWS_BEFORE;
                    change_color();
                } else { // phase == Yinsh.Phase.REMOVE_RING_BEFORE
                    phase = Yinsh.Phase.PUT_MARKER;
                }
            }
            return true;
        };

        this.removed_ring_number = function (color) {
            return (color == Yinsh.Engine.Color.BLACK) ? removed_black_ring_number :
                removed_white_ring_number;
        };

        this.select_row = function (coordinates, color) {
            var rows = this.get_rows(color);

            //TODO: to finish
            return rows[0];
        }

        this.verify_moving = function (origin, destination) {
            var letters = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" ];
            var state = {
                ok: true,
                no_vacant: false
            };
            var n;
            var l;

            if (intersections[origin.hash()].state() != Yinsh.State.BLACK_MARKER_RING &&
                intersections[origin.hash()].state() != Yinsh.State.WHITE_MARKER_RING) {
                return false;
            }

            if (origin.hash() == destination.hash() ||
                intersections[destination.hash()].state() != Yinsh.State.VACANT) {
                return false;
            }

            if (origin.letter() == destination.letter()) {
                if (origin.number() < destination.number()) {
                    n = origin.number() + 1;
                    state.no_vacant = false;
                    while (n < destination.number() && state.ok) {
                        state = verify_intersection(origin.letter(), n, state);
                        ++n;
                    }
                } else {
                    n = origin.number() - 1;
                    state.no_vacant = false;
                    while (n > destination.number() && state.ok) {
                        state = verify_intersection(origin.letter(), n, state);
                        --n;
                    }
                }
            } else if (origin.number() == destination.number()) {
                if (origin.letter().charCodeAt(0) < destination.letter().charCodeAt(0)) {
                    l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) + 1;
                    state.no_vacant = false;
                    while (l < (destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                        state = verify_intersection(letters[l], origin.number(), state);
                        ++l;
                    }
                } else {
                    l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) - 1;
                    state.no_vacant = false;

                    while (l > (destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                        state = verify_intersection(letters[l], origin.number(), state);
                        --l;
                    }
                }
            } else {
                if (origin.letter().charCodeAt(0) - destination.letter().charCodeAt(0) ==
                    origin.number() - destination.number()) {
                    if (origin.letter().charCodeAt(0) < destination.letter().charCodeAt(0)) {
                        n = origin.number() + 1;
                        l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) + 1;
                        state.no_vacant = false;
                        while (l < (destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                            state = verify_intersection(letters[l], n, state);
                            ++l;
                            ++n;
                        }
                    } else {
                        n = origin.number() - 1;
                        l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) - 1;
                        state.no_vacant = false;
                        while (l > (destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                            state = verify_intersection(letters[l], n, state);
                            --l;
                            --n;
                        }
                    }
                } else {
                    state.ok = false;
                }
            }
            return state.ok;
        };

        this.winner_is = function () {
            if (this.is_finished()) {
                if (type == Yinsh.GameType.REGULAR) {
                    if (removed_black_ring_number == 3 ||
                        removed_black_ring_number > removed_white_ring_number) {
                        return Yinsh.Color.BLACK;
                    } else if (removed_white_ring_number == 3 |
                        removed_black_ring_number < removed_white_ring_number) {
                        return Yinsh.Color.WHITE;
                    } else {
                        return Yinsh.Color.NONE;
                    }
                } else {
                    if (removed_black_ring_number == 1) {
                        return Yinsh.Color.BLACK;
                    } else if (removed_white_ring_number == 1) {
                        return Yinsh.Color.WHITE;
                    } else {
                        return Yinsh.Color.NONE;
                    }
                }
            }
            return false;
        };

// private methods
        var build_row = function (letter, number, state, previous) {
            var result = previous;
            var coordinates = new Yinsh.Coordinates(letter, number);
            var intersection = intersections[coordinates.hash()];

            if (!result.start && intersection.state() == state) {
                result.start = true;
                result.row.push(coordinates);
            } else if (result.start && intersection.state() == state) {
                result.row.push(coordinates);
            } else if (result.start && intersection.state() != state) {
                if (result.row.length >= 5) {
                    result.rows.push(result.row);
                }
                result.start = false;
                result.row = [];
            }
            return result;
        };

        var change_color = function () {
            if (current_color == Yinsh.Color.WHITE) {
                current_color = Yinsh.Color.BLACK;
            } else {
                current_color = Yinsh.Color.WHITE;
            }
        };

        var flip = function (letter, number) {
            var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

            if (coordinates in intersections) {
                intersections[coordinates].flip();
            }
        };

        var flip_row = function (origin, destination) {
            var n;
            var l;

            if (origin.letter() == destination.letter()) {
                if (origin.number() < destination.number()) {
                    n = origin.number() + 1;
                    while (n < destination.number()) {
                        flip(origin.letter(), n);
                        ++n;
                    }
                } else {
                    n = origin.number() - 1;
                    while (n > destination.number()) {
                        flip(origin.letter(), n);
                        --n;
                    }
                }
            } else if (origin.number() == destination.number()) {
                if (origin.letter() < destination.letter()) {
                    l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) + 1;
                    while (l < destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) {
                        flip(letters[l], origin.number());
                        ++l;
                    }
                } else {
                    l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) - 1;
                    while (l > destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) {
                        flip(letters[l], origin.number());
                        --l;
                    }
                }
            } else {
                if (origin.letter() < destination.letter()) {
                    n = origin.number() + 1;
                    l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) + 1;
                    while (l < destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) {
                        flip(letters[l], n);
                        ++l;
                        ++n;
                    }
                } else {
                    n = origin.number() - 1;
                    l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) - 1;
                    while (l > destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) {
                        flip(letters[l], n);
                        --l;
                        --n;
                    }
                }
            }
        };

        var get_intersection = function (letter, number) {
            var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

            if (coordinates in intersections) {
                return intersections[coordinates];
            } else {
                return false;
            }
        };

        var remove_black_ring = function (coordinates) {
            var list = [];
            var i = 0;

            while (i < placed_black_ring_coordinates.length) {
                if (placed_black_ring_coordinates[i].hash() != coordinates.hash()) {
                    list.push(placed_black_ring_coordinates[i]);
                }
                ++i;
            }
            placed_black_ring_coordinates = list;
        };

        var remove_white_ring = function (coordinates) {
            var list = [];
            var i = 0;

            while (i < placed_white_ring_coordinates.length) {
                if (placed_white_ring_coordinates[i].hash() != coordinates.hash()) {
                    list.push(placed_white_ring_coordinates[i]);
                }
                ++i;
            }
            placed_white_ring_coordinates = list;
        };

        var remove_marker = function (letter, number) {
            var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

            if (coordinates in intersections) {
                intersections[coordinates].remove_marker();
                ++marker_number;
            }
        };

        var verify_intersection = function (letter, number, result) {
            var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

            if (coordinates in intersections) {
                var state = intersections[coordinates].state();

                if (state == Yinsh.State.BLACK_RING || state == Yinsh.State.WHITE_RING) {
                    result.no_vacant = false; // if ring is presenter after row of markers
                    result.ok = false;
                } else if (state == Yinsh.State.BLACK_MARKER || state == Yinsh.State.WHITE_MARKER) {
                    result.no_vacant = true;
                } else if (state == Yinsh.State.VACANT && result.no_vacant) {
                    result.ok = false;
                }
            }
            return result;
        };

        var verify_intersection_in_row = function (letter, number, color, ok) {
            var _ok = ok;
            var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

            if (coordinates in intersections) {
                if (intersections[coordinates].color() != color) {
                    _ok = false;
                }
            }
            return _ok;
        };

        var verify_row = function (begin, end, color) {
            var ok = true;
            var n;
            var l;

            if (begin.letter() == end.letter()) {
                if (begin.number() < end.number()) {
                    n = begin.number() + 1;
                    while (n < end.number() && ok) {
                        verify_intersection_in_row(begin.letter(), n, color, ok);
                        ++n;
                    }
                } else {
                    n = begin.number() - 1;
                    while (n > end.number() && ok) {
                        verify_intersection_in_row(begin.letter(), n, color, ok);
                        --n;
                    }
                }
            } else if (begin.number() == end.number()) {
                if (begin.letter() < end.letter()) {
                    l = begin.letter() + 1;
                    while (l < end.letter() && ok) {
                        verify_intersection_in_row(l, begin.number(), color, ok);
                        ++l;
                    }
                } else {
                    l = begin.letter() - 1;
                    while (l > end.letter() && ok) {
                        verify_intersection_in_row(l, begin.number(), color, ok);
                        --l;
                    }
                }
            } else {
                if (begin.letter() - end.letter() ==
                    begin.number() - end.number()) {
                    if (begin.letter() < end.letter()) {
                        n = begin.number() + 1;
                        l = begin.letter() + 1;
                        while (l < end.letter() && ok) {
                            verify_intersection_in_row(l, n, color, ok);
                            ++l;
                            ++n;
                        }
                    } else {
                        n = begin.number() - 1;
                        l = begin.letter() - 1;
                        while (l > end.letter() && ok) {
                            verify_intersection_in_row(l, n, color, ok);
                            --l;
                            --n;
                        }
                    }
                } else {
                    ok = false;
                }
            }
            return ok;
        };

// private attributes
        var type = type;
        var current_color = color;
        var marker_number = 51;
        var placed_black_ring_coordinates = [];
        var placed_white_ring_coordinates = [];
        var removed_black_ring_number = 0;
        var removed_white_ring_number = 0;
        var intersections = {};
        var phase = Yinsh.Phase.PUT_RING;
        var letters = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" ];

        for (var i = 0; i < letters.length; ++i) {
            var l = letters[i];

            for (var n = Yinsh.begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)];
                 n <= Yinsh.end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; ++n) {
                var coordinates = new Yinsh.Coordinates(l, n);

                intersections[coordinates.hash()] = new Yinsh.Intersection(coordinates);
            }
        }
    },

// ***************
// GuiPlayer class

    GuiPlayer: function (color, engine) {

// public methods
        this.clear_selected_ring = function () {
            selected_ring = new Yinsh.Coordinates('X', -1);
        };

        this.clear_selected_row = function () {
            selected_row = [];
        };

        this.color = function () {
            return mycolor;
        };

        this.draw = function () {
            compute_deltas();

            context.lineWidth = 1.;

            // background
            context.rect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "#ffffff";
            context.fill();
            context.stroke();

            draw_grid();
            draw_coordinates();
            draw_state();

            if (engine.phase() == Yinsh.Phase.MOVE_RING && selected_ring.is_valid()) {
                draw_possible_moving();
            }
        };

        this.engine = function () {
            return engine;
        };

        this.get_selected_coordinates = function () {
            return selected_coordinates;
        };

        this.get_selected_ring = function () {
            return selected_ring;
        };

        this.set_canvas = function (c) {
            canvas = c;
            context = c.getContext("2d");
            height = canvas.height;
            width = canvas.width;
            canvas.addEventListener("click", onClick, true);
            this.draw();
        };

        this.set_manager = function (m) {
            manager = m;
        };

// private methods
        var compute_deltas = function () {
            offset = 30;
            delta_x = (width - 2 * offset) / 10.;
            delta_y = delta_x;
            delta_xy = delta_y / 2;
        };

        var compute_letter = function (x, y) {
            var letters = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" ];
            var index = Math.floor((x - offset) / delta_x);
            var x_ref = offset + delta_x * index;
            var x_ref_2 = offset + delta_x * (index + 1);
            var _letter = 'X';

            if (x < offset) {
                _letter = 'A';
            } else if (x <= x_ref + delta_x / 2 && x >= x_ref && x <= x_ref + tolerance) {
                _letter = letters[index];
            } else if (x > x_ref + delta_x / 2 && x >= x_ref_2 - tolerance) {
                _letter = letters[index + 1];
            }
            return _letter;
        };

        var compute_number = function (x, y) {
            var pt = compute_coordinates('A'.charCodeAt(0), 1);

            // translation to A1 and rotation
            var X = x - pt[0];
            var Y = y - pt[1];
            var sin_alpha = 1. / Math.sqrt(5);
            var cos_alpha = 2. * sin_alpha;

            var x2 = Math.floor((X * sin_alpha - Y * cos_alpha) + pt[0]);
            var delta_x2 = Math.floor(delta_x * cos_alpha);

            var index = Math.floor((x2 - offset) / delta_x2);
            var x_ref = Math.floor(offset + delta_x2 * index);
            var x_ref_2 = Math.floor(offset + delta_x2 * (index + 1));

            var _number = -1;

            if (x2 > 0 && x2 < offset) {
                _number = 1;
            } else if (x2 <= x_ref + delta_x2 / 2 && x2 >= x_ref && x2 <= x_ref + tolerance) {
                _number = index + 1;
            } else if (x2 > x_ref + delta_x2 / 2 && x2 >= x_ref_2 - tolerance) {
                _number = index + 2;
            }
            return _number;
        };

        var compute_coordinates = function (letter, number) {
            var index_x = letter - 'A'.charCodeAt(0);
            var x = offset + delta_x * index_x;
            var y = offset + 7 * delta_y + delta_xy * index_x -
                (number - 1) * delta_y;

            return [x, y];
        };

        var draw_coordinates = function () {
            var pt;

            context.fillStyle = "#000000";
            context.font = "16px _sans";
            context.textBaseline = "top";

            // letters
            for (var l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
                pt = compute_coordinates(l, Yinsh.begin_number[l - 'A'.charCodeAt(0)]);
                pt[0] -= 5;
                pt[1] += 20;

                context.fillText(String.fromCharCode(l), pt[0], pt[1]);
            }

            // numbers
            context.textBaseline = "bottom";
            for (var n = 1; n < 12; ++n) {
                pt = compute_coordinates(Yinsh.begin_letter[n - 1].charCodeAt(0), n);
                pt[0] -= 15 + (n > 9 ? 5 : 0);
                pt[1] -= 3;

                context.fillText(n.toString(), pt[0], pt[1]);
            }
        };

        var draw_grid = function () {
            var _pt_begin;
            var _pt_end;

            context.lineWidth = 1;
            context.strokeStyle = "#000000";
            for (var l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
                var index = l - 'A'.charCodeAt(0);

                _pt_begin = compute_coordinates(l, Yinsh.begin_number[index]);
                _pt_end = compute_coordinates(l, Yinsh.end_number[index]);
                context.moveTo(_pt_begin[0], _pt_begin[1]);
                context.lineTo(_pt_end[0], _pt_end[1]);
            }
            for (var n = 1; n < 12; ++n) {
                _pt_begin = compute_coordinates(Yinsh.begin_letter[n - 1].charCodeAt(0), n);
                _pt_end = compute_coordinates(Yinsh.end_letter[n - 1].charCodeAt(0), n);
                context.moveTo(_pt_begin[0], _pt_begin[1]);
                context.lineTo(_pt_end[0], _pt_end[1]);
            }

            for (var i = 0; i < 11; ++i) {
                _pt_begin = compute_coordinates(Yinsh.begin_diagonal_letter[i].charCodeAt(0),
                    Yinsh.begin_diagonal_number[i]);
                _pt_end = compute_coordinates(Yinsh.end_diagonal_letter[i].charCodeAt(0),
                    Yinsh.end_diagonal_number[i]);
                context.moveTo(_pt_begin[0], _pt_begin[1]);
                context.lineTo(_pt_end[0], _pt_end[1]);
            }
            context.stroke();
        };

        var draw_marker = function (x, y, color) {
            context.beginPath();
            context.lineWidth = 1;
            if (color == Yinsh.Color.BLACK) {
                context.fillStyle = "#000000";
            } else if (color == Yinsh.Color.WHITE) {
                context.fillStyle = "rgb(192, 192, 192)";
            }
            context.arc(x, y, delta_x * (1. / 3 - 1. / 10) - 1, 0.0, 2 * Math.PI, false);
            context.fill();
            context.stroke();
            context.closePath();
        };

        var draw_possible_moving = function () {
            var list = engine.get_possible_moving_list(selected_ring, engine.current_color(), true);

            context.strokeStyle = "#FFFFFF";
            context.fillStyle = "#0000FF";
            context.lineWidth = 1;
            for (var i = 0; i < list.length; ++i) {
                var pt;

                pt = compute_coordinates(list[i].letter().charCodeAt(0), list[i].number());
                context.beginPath();
                context.arc(pt[0], pt[1], 5, 0.0, 2 * Math.PI, false);
                context.fill();
                context.stroke();
                context.closePath();
            }

        };

        var draw_ring = function (x, y, color) {
            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = "#000000";
            context.arc(x, y, delta_x * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI, false);
            context.stroke();
            context.arc(x, y, delta_x * (1. / 3 - 1. / 10) - 1, 0.0, 2 * Math.PI, false);
            context.stroke();
            context.closePath();

            context.beginPath();
            context.lineWidth = delta_x / 5;

            /*            var gr = context.createLinearGradient(0, 0, 100, 100);
             if (color == Yinsh.Color.BLACK) {
             gr.addColorStop(0,'rgb(0,0,0)');
             gr.addColorStop(1,'rgb(192,192,192)');
             } else {
             gr.addColorStop(0,'rgb(192,192,192)');
             gr.addColorStop(1,'rgb(255,255,255)');
             }
             context.strokeStyle = gr; */

            if (color == Yinsh.Color.BLACK) {
                context.strokeStyle = "#000000";
            } else {
                context.strokeStyle = "#ffffff";
            }

            context.arc(x, y, delta_x / 3, 0.0, 2 * Math.PI, false);
            context.stroke();
            context.closePath();
        };

        var draw_rows = function () {
            if (engine.phase() == Yinsh.Phase.REMOVE_ROWS_AFTER ||
                engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE) {
                var srows = [engine.get_rows(engine.current_color())];

                for (var i = 0; i < srows.length; ++i) {
                    for (var j = 0; j < srows[i].length; ++j) {
                        var begin = srows[i][j][0];
                        var end = srows[i][j][srows[i][j].length - 1];
                        var pt1, pt2;
                        var alpha_1, beta_1;
                        var alpha_2, beta_2;

                        pt1 = compute_coordinates(begin.letter().charCodeAt(0), begin.number());
                        pt2 = compute_coordinates(end.letter().charCodeAt(0), end.number());

                        if (pt1[0] == pt2[0]) {
                            if (pt1[1] < pt2[1]) {
                                alpha_1 = Math.PI;
                                beta_1 = 0;
                                alpha_2 = 0;
                                beta_2 = Math.PI;
                            } else {
                                alpha_1 = 0;
                                beta_1 = Math.PI;
                                alpha_2 = Math.PI;
                                beta_2 = 0;
                            }
                        } else {
                            var omega_1 = Math.acos(1. / Math.sqrt(5));

                            if (pt1[0] < pt2[0]) {
                                if (pt1[1] < pt2[1]) {
                                    alpha_1 = Math.PI - omega_1;
                                    beta_1 = 3 * Math.PI / 2 + omega_1 / 2;
                                    alpha_2 = 3 * Math.PI / 2 + omega_1 / 2;
                                    beta_2 = Math.PI - omega_1;
                                } else {
                                    alpha_1 = omega_1;
                                    beta_1 = Math.PI + omega_1;
                                    alpha_2 = Math.PI + omega_1;
                                    beta_2 = omega_1;
                                }
                            }
                        }
                        context.beginPath();
                        context.strokeStyle = "#00FF00";
                        context.lineWidth = 4;
                        context.arc(pt1[0], pt1[1], delta_x / 3 + 5, alpha_1, beta_1, false);
                        context.lineTo(pt2[0] + (delta_x / 3 + 5) * Math.cos(alpha_2),
                            pt2[1] + (delta_x / 3 + 5) * Math.sin(alpha_2));
                        context.arc(pt2[0], pt2[1], delta_x / 3 + 5, alpha_2, beta_2, false);
                        context.lineTo(pt1[0] + (delta_x / 3 + 5) * Math.cos(alpha_1),
                            pt1[1] + (delta_x / 3 + 5) * Math.sin(alpha_1));
                        context.stroke();
                        context.closePath();
                    }
                }

                //TODO
                /*                yinsh::Row::const_iterator it = mSelectedRow.begin();

                 while (it != mSelectedRow.end()) {
                 int x,y;

                 computeCoordinates(it->letter(), it->number(), x, y);
                 mContext->set_source_rgb(0, 0, 255);
                 mContext->set_line_width(1.);
                 mContext->arc(x, y, mDelta_x * (1. / 3 - 1. / 10) - 1,
                 0.0, 2 * M_PI);
                 mContext->fill();
                 mContext->stroke();
                 ++it;
                 } */
            }
        };

        var draw_state = function () {
            var intersections = engine.intersections();

            for (var key in intersections) {
                var intersection = intersections[key];
                var pt = compute_coordinates(intersection.letter().charCodeAt(0), intersection.number());

                switch (intersection.state()) {
                    case Yinsh.State.VACANT:
                        break;
                    case Yinsh.State.BLACK_MARKER:
                        draw_marker(pt[0], pt[1], Yinsh.Color.BLACK);
                        break;
                    case Yinsh.State.WHITE_MARKER:
                        draw_marker(pt[0], pt[1], Yinsh.Color.WHITE);
                        break;
                    case Yinsh.State.BLACK_MARKER_RING:
                        draw_marker(pt[0], pt[1], Yinsh.Color.BLACK);
                        draw_ring(pt[0], pt[1], Yinsh.Color.BLACK);
                        break;
                    case Yinsh.State.BLACK_RING:
                        draw_ring(pt[0], pt[1], Yinsh.Color.BLACK);
                        break;
                    case Yinsh.State.WHITE_MARKER_RING:
                        draw_marker(pt[0], pt[1], Yinsh.Color.WHITE);
                        draw_ring(pt[0], pt[1], Yinsh.Color.WHITE);
                        break;
                    case Yinsh.State.WHITE_RING:
                        draw_ring(pt[0], pt[1], Yinsh.Color.WHITE);
                        break;
                }
            }
            draw_rows();
        };

        var onClick = function (event) {
            var x = event.clientX - canvas.offsetLeft;
            var y = event.clientY - canvas.offsetTop;
            var letter = compute_letter(x, y);
            var number = compute_number(x, y);
            var ok = false;

            if (letter != 'X' && number != -1 &&
                engine.exist_intersection(letter, number)) {
                if (engine.phase() == Yinsh.Phase.PUT_RING &&
                    engine.intersection_state(letter, number) == Yinsh.State.VACANT) {
                    selected_coordinates = new Yinsh.Coordinates(letter, number);
                    ok = true;
                } else if (engine.phase() == Yinsh.Phase.PUT_MARKER &&
                    ((engine.intersection_state(letter, number) == Yinsh.State.BLACK_RING &&
                        engine.current_color() == Yinsh.Color.BLACK) ||
                        (engine.intersection_state(letter, number) == Yinsh.State.WHITE_RING &&
                            engine.current_color() == Yinsh.Color.WHITE))) {
                    selected_coordinates = new Yinsh.Coordinates(letter, number);
                    selected_ring = selected_coordinates;
                    ok = true;
                } else if (engine.phase() == Yinsh.Phase.MOVE_RING) {
                    if (selected_ring.is_valid()) {
                        if (engine.verify_moving(selected_ring,
                            new Yinsh.Coordinates(letter, number))) {
                            selected_coordinates = new Yinsh.Coordinates(letter, number);
                            ok = true;
                        }
                    }
                } else if (engine.phase() == Yinsh.Phase.REMOVE_ROWS_AFTER ||
                    engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE) {
                    selected_coordinates = new Yinsh.Coordinates(letter, number);
                    ok = true;
                } else if ((engine.phase() == Yinsh.Phase.REMOVE_RING_AFTER ||
                    engine.phase() == Yinsh.Phase.REMOVE_RING_BEFORE) &&
                    ((engine.intersection_state(letter, number) == Yinsh.State.BLACK_RING &&
                        engine.current_color() == Yinsh.Color.BLACK) ||
                        (engine.intersection_state(letter, number) == Yinsh.State.WHITE_RING &&
                            engine.current_color() == Yinsh.Color.WHITE))) {
                    selected_coordinates = new Yinsh.Coordinates(letter, number);
                    ok = true;
                }
            }
            if (ok) {
                manager.play();
            }
        };

// private attributes
        var engine = engine;
        var mycolor = color;

        var canvas;
        var context;
        var manager;
        var height;
        var width;

        var tolerance = 15;
        var delta_x = 0;
        var delta_y = 0;
        var delta_xy = 0;
        var offset = 0;

        var selected_coordinates = new Yinsh.Coordinates('X', -1);
        var selected_ring = new Yinsh.Coordinates('X', -1);
        var selected_row = [];
    },

// *************
// Manager class

    Manager: function (engine, gui_player, other_player) {

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
    },

// ******************
// RamdomPlayer class

    RandomPlayer: function (color, engine) {

// public methods
        this.move_ring = function (origin) {
            var list = engine.get_possible_moving_list(origin, mycolor, false);

            if (list.length != 0) {
                var ring_coordinates = list[Math.floor(Math.random() * list.length)];

                engine.move_ring(origin, ring_coordinates);
                return ring_coordinates;
            } else {
                return new Yinsh.Coordinates('X', -1);
            }
        };

        this.put_marker = function () {
            var ring_coordinates;
            var list = engine.get_placed_ring_coordinates(mycolor);
            var ok = false;

            while (!ok) {
                ring_coordinates = list[Math.floor(Math.random() * list.length)];
                ok = engine.get_possible_moving_list(ring_coordinates, mycolor, false).length > 0;
            }
            engine.put_marker(ring_coordinates, mycolor);
            return ring_coordinates;
        };

        this.put_ring = function () {
            var list = engine.get_free_intersections();
            var index = Math.floor(Math.random() * list.length);
            var coordinates = list[index];

            engine.put_ring(coordinates, mycolor);
            return coordinates;
        };

        this.remove_ring = function () {
            var ring_index = Math.floor(Math.random() * engine.get_placed_ring_coordinates(mycolor).length);
            var ring_coordinates = engine.get_placed_ring_coordinates(mycolor)[ring_index];

            engine.remove_ring(ring_coordinates, mycolor);
            return ring_coordinates;
        };

        this.remove_rows = function () {
            // TODO
        };

        this.remove_no_row = function () {
            engine.remove_no_row();
        };

// private methods

// private attributes
        var mycolor = color;
        var engine = engine;
    }

}; // namespace YinshGui