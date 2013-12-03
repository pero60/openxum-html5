<?php
/**
 * Created by PhpStorm.
 * User: Tim
 * Date: 03/12/13
 * Time: 09:55
 *
 *
 */


class EmailConfig {
    public $gmail = array(
        'host' => 'smtp.gmail.com',
        'port' => 465,
        'username' => 'Tim.herlaud@gmail.com',
        'password' => 'secret',
        'transport' => 'Smtp',
        'tls' => true
    );
}