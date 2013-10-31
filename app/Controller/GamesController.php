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

class MaitresController extends AppController
{
    public $helpers = array('Html', 'Form', 'Session');
    var $uses = array('Apprenti', 'Maitre', 'User', 'Validation', 'WorkflowLink');

    var $name = 'Maitres';

    public function beforeFilter()
    {
        parent::beforeFilter();
    }

    public function isAuthorized($user)
    {
        if ($user['role'] === 'admin' && in_array($this->action, array('add', 'edit', 'delete', 'index'))) {
            return true;
        } else if ($user['role'] === 'manager' && in_array($this->action, array('view'))) {
            return true;
        } else if ($user['role'] === 'external' && in_array($this->action, array('validation'))) {
            return true;
        } else {
            return false;
        }
    }

    public function add()
    {
        if ($this->request->is('post')) {

            $this->Maitre->create();
            $username = $this->buildUsername($this->request->data['Maitre']);
            $data = array(
                'username' => $username,
                'password' => $this->request->data['Maitre']['telephone'],
                'role' => 'external'
            );
            $this->User->save($data);
            $this->request->data['Maitre']['user_id'] = $this->User->id;
            if ($this->Maitre->save($this->request->data)) {
                $this->Session->setFlash(__('Le maitre est créé'));
                return $this->redirect(array('action' => 'index'));
            }
            $this->Session->setFlash(__('Impossible de créér le maitre'));
        }
        $entreprises = $this->Maitre->Entreprise->find('list', array('fields' => array('id', 'nom')));
        $this->set('entreprises', $entreprises);
    }

    public function delete($id)
    {
        if ($this->request->is('get')) {
            throw new MethodNotAllowedException();
        }
        if ($this->Maitre->delete($id)) {
            $this->Session->setFlash(__('Le maitre avec l\'identifiant %s a été supprimé', h($id)));
            return $this->redirect(array('action' => 'index'));
        }
    }

    public function edit($id = null)
    {
        if (!$id) {
            throw new NotFoundException(__('Maitre inconnu'));
        }
        $maitre = $this->Maitre->findById($id);
        if (!$maitre) {
            throw new NotFoundException(__('Maitre inconnu'));
        }
        if ($this->request->is('post') || $this->request->is('put')) {
            $this->Maitre->id = $id;
            if ($this->Maitre->save($this->request->data)) {
                $this->Session->setFlash(__('Le maitre a été mis à jour'));
                return $this->redirect(array('action' => 'index'));
            }
            $this->Session->setFlash(__('Le maitre n\'a pas pu être mis à jour'));
        }
        if (!$this->request->data) {
            $this->request->data = $maitre;
        }
        $entreprises = $this->Maitre->Entreprise->find('list', array('fields' => array('id', 'nom')));
        $this->set('entreprises', $entreprises);
    }

    public function index()
    {
        $this->set('maitres', $this->Maitre->find('all'));
    }

    public function validation($id)
    {
        $validation = $this->Validation->find('first', array('conditions' => array('Validation.apprenti_id' => $id)));
        if ($validation['Validation']['apprenti_todo'] && $validation['Validation']['tuteur_todo']) {
            if ($this->Validation->delete($validation['Validation']['id'])) {
                $this->Apprenti->recursive = -1;
                $apprenti = $this->Apprenti->find('first', array('conditions' => array('Apprenti.id' => $id)));
                $workflow_link = $this->WorkflowLink->find('first', array('conditions' => array('WorkflowLink.source_workflow_item_id' => $apprenti['Apprenti']['workflow_item_id'])));
                if (!empty($workflow_link)) {
                    $apprenti['Apprenti']['workflow_item_id'] = $workflow_link['WorkflowLink']['destination_workflow_item_id'];
                    if ($this->Apprenti->save($apprenti)) {
                        $this->Session->setFlash(__('La validation a été effectuée et le workflow a évolué'));
                        return $this->redirect(array('controller' => 'apprentis', 'action' => 'index_tuteur'));
                    } else {
                        $this->Session->setFlash(__('La validation n\'a pas été effectuée'));
                        return $this->redirect(array('controller' => 'apprentis', 'action' => 'index_tuteur'));
                    }
                } else {
                    $this->Session->setFlash(__('La validation a été effectuée et le workflow est fini'));
                    return $this->redirect(array('controller' => 'apprentis', 'action' => 'index_tuteur'));
                }
            } else {
                $this->Session->setFlash(__('La validation n\'a pas été effectuée'));
                return $this->redirect(array('controller' => 'apprentis', 'action' => 'index_tuteur'));
            }
        } else {
            $validation['Validation']['maitre_todo'] = true;
            if ($this->Validation->save($validation)) {
                $this->Session->setFlash(__('La validation a été effectuée'));
                return $this->redirect(array('controller' => 'apprentis', 'action' => 'index_maitre'));
            } else {
                $this->Session->setFlash(__('La validation n\'a pas été effectuée'));
                return $this->redirect(array('controller' => 'apprentis', 'action' => 'index_maitre'));
            }
        }
    }

    public function view($id = null)
    {
        if (!$id) {
            throw new NotFoundException(__('Maitre inconnu'));
        }
        $maitre = $this->Maitre->findById($id);
        if (!$maitre) {
            throw new NotFoundException(__('Maitre inconnu'));
        }
        $this->set('maitre', $maitre);
    }

    private function buildUsername($maitre)
    {
        $index = 1;
        $username = substr($maitre['prenom'], 0, 1) . $maitre['nom'];
        while (!empty($this->User->findByUsername($username))) {
            $username = substr($maitre['prenom'], 0, 1) . $maitre['nom'] . '_' . $index;
            $index = $index + 1;
        }
        return $username;
    }
}

?>