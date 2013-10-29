<?php
/**
 *  This file is part of LibreApprenti.
 *
 *  LibreApprenti is free software: you can redistribute it and/or modify
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
 *  along with LibreApprenti.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @copyright     Copyright (c) Université du Littoral - Côte d'Opale / CUEEP
 * @link          http://github.com/eramat/LibreApprenti
 * @package       app.View.Layouts
 * @license       http://www.gnu.org/licenses/ GPLv3 License
 */
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <?php echo $this->Html->charset(); ?>
    <title>
        <?php __('OpenXum'); ?>
        <?php echo $title_for_layout; ?>
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php
    echo $this->Html->meta('icon');

    echo $this->Html->css('openxum');
    echo $this->Html->css('jquery.mobile.min');

    echo $this->Html->script('jquery.min');
    echo $this->Html->script('jquery.mobile.min');
    echo $scripts_for_layout;
    ?>
</head>
<body>
<div data-role="page">
    <div data-role="header">
        <h1>OpenXum</h1>
        <div data-role="navbar">
            <ul>
                <li>
                    <?php
                    echo $this->Html->link(__('Home'), array('controller' => 'pages', 'action' => 'display', 'home'));
                    ?>
                </li>
                <li>
                    <?php
                    echo $this->Html->link(__('Games'), array('controller' => 'pages', 'action' => 'display', 'games'));
                    ?>
                </li>
                <li><a href="c.html">Help</a></li>
                <li>
                    <?php
                    if (AuthComponent::user('id') != 0) {
                        echo $this->Html->link('logout', array('controller' => 'users', 'action' => 'logout')).' '.AuthComponent::user('username');
                    } else {
                        echo $this->Html->link('Login', array('controller' => 'users', 'action' => 'login'));
                    }
                    ?>
                </li>
            </ul>
        </div>
    </div>
    <div data-role="content">
        <?php echo $this->Session->flash(); ?>
        <?php echo $content_for_layout; ?>
    </div>
    <div style="position: absolute; bottom: 0; width: 100%;" data-role="footer">
        <h4><a href="www.openxum.org">OpenXum project</a> - Copyright 2011-2014</h4>
    </div>
</div>
</body>
</html>