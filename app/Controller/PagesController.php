<?php
/**
 *  This file is part of OpenXum project.
 *
 *  OpenXum is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This Web application is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with OpenXum.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @copyright     Copyright (c) Eric Ramat
 * @link          http://github.com/openxum-team/openxum-html5
 * @package       app.Controller
 * @license       http://www.gnu.org/licenses/ GPLv3 License
 */

App::uses('AppController', 'Controller');

class PagesController extends AppController {

    public $uses = array();
    public $helpers = array('Session');

    public function beforeFilter()
    {
        $this->Auth->allow('display');
        parent::beforeFilter();
    }

    public function display() {
        $path = func_get_args();

        $count = count($path);
        if (!$count) {
            return $this->redirect('/');
        }
        $page = $subpage = $title_for_layout = null;

        if (!empty($path[0])) {
            $page = $path[0];
        }
        if (!empty($path[1])) {
            $subpage = $path[1];
        }
        if (!empty($path[$count - 1])) {
            $title_for_layout = Inflector::humanize($path[$count - 1]);
        }
        $this->set(compact('page', 'subpage', 'title_for_layout'));

        try {
            $this->render(implode('/', $path));
        } catch (MissingViewException $e) {
            if (Configure::read('debug')) {
                throw $e;
            }
            throw new NotFoundException();
        }
    }
}
