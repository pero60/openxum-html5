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

class UsersController extends AppController
{
    public function beforeFilter()
    {
        parent::beforeFilter();
    }

    public function isAuthorized($user) {
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        } else { return false; }
    }

    public function index()
    {
        $this->User->recursive = 0;
        $this->set('users', $this->paginate());
    }

    public function view($id = null)
    {
        $this->User->id = $id;
        if (!$this->User->exists()) {
            throw new NotFoundException(__('Utilisateur invalide'));
        }
        $this->set('user', $this->User->read(null, $id));
    }

    public function add()
    {
        if ($this->request->is('post')) {
            $d = $this->request->data;
            $d['User']['id'] = null;
            if($d['User']['password']!=$d['User']['password_verif'])
                $this->Session->setFlash('Les mots de passe doivent être identique');
            elseif($d['User']['email']!=$d['User']['email_verif'])
                $this->Session->setFlash('Les emails doivent être identique');

                $this->User->create();
                if ($this->User->save($this->request->data)) {
                    $this->Session->setFlash(__('L\'utilisateur a été sauvegardé'));
                    return $this->redirect(array('action' => 'index'));
                } else {
                    $this->Session->setFlash(__('L\'utilisateur n\'a pas été sauvegardé. Merci de réessayer.'));
                }
        }
    }

    public function edit($id = null)
    {
        $this->User->id = $id;
        if (!$this->User->exists()) {
            throw new NotFoundException(__('Utilisateur invalide'));
        }
        if ($this->request->is('post') || $this->request->is('put')) {
            if ($this->User->save($this->request->data)) {
                $this->Session->setFlash(__('L\'utilisateur a été sauvegardé'));
                return $this->redirect(array('action' => 'index'));
            } else {
                $this->Session->setFlash(__('L\'utilisateur n\'a pas été sauvegardé. Merci de réessayer.'));
            }
        } else {
            $this->request->data = $this->User->read(null, $id);
            unset($this->request->data['User']['password']);
        }
    }

    public function delete($id = null)
    {
        if (!$this->request->is('post')) {
            throw new MethodNotAllowedException();
        }
        $this->User->id = $id;
        if (!$this->User->exists()) {
            throw new NotFoundException(__('Utilisateur invalide'));
        }
        if ($this->User->delete()) {
            $this->Session->setFlash(__('Utilisateur supprimé'));
            return $this->redirect(array('action' => 'index'));
        }
        $this->Session->setFlash(__('L\'utilisateur n\'a pas été supprimé'));
        return $this->redirect(array('action' => 'index'));
    }

    public function login()
    {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                if (AuthComponent::user('role') === 'student') {
                    return $this->redirect(array('controller' => 'pages', 'action' => 'display', 'home'));
                }
                return $this->redirect($this->Auth->redirectUrl());
            } else {
                $this->Session->setFlash(__('Login ou mot de passe invalide, réessayer'));
            }
        }
    }
    public function account(){
        $this->Session->setFlash(__('Login ou mot de passe invalide, réessayer'));
    }
}
