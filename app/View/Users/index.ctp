<h1>Utilisateurs</h1>

<?php echo $this->Html->link($this->Html->image('user-add.png', array('alt' => 'add', 'height' => '24px')),
    array('controller' => 'users', 'action' => 'add'),
    array('escape' => false)); ?>

<table>
    <tr>
        <th>Login</th>
        <th>Rôle</th>
        <th>Action</th>
    </tr>

    <?php foreach ($users as $user): ?>
    <tr>
        <td>
            <?php
            echo $this->Html->link($user['User']['username'],
                array('controller' => 'users', 'action' => 'view', $user['User']['id']));
            ?>
        </td>
        <td><?php
            if ($user['User']['role'] === 'admin') {
                echo '<b><span style="color:red">';
            }
            echo $user['User']['role'];
            if ($user['User']['role'] === 'admin') {
                echo "<span></b>";
            }
            ?>
        </td>
        <td>
            <?php echo $this->Html->link($this->Html->image('edit.png', array('alt' => 'edit', 'height' => '24px')),
                array('action' => 'edit', $user['User']['id']),
                array('escape' => false)); ?>
            <?php echo $this->Form->postLink($this->Html->image('user-delete.png', array('alt' => 'delete', 'height' => '24px')),
                array('action' => 'delete', $user['User']['id']),
                array('escape' => false),
                'Etes-vous sûr de vouloir supprimer ?');
            ?>
        </td>
    </tr>
    <?php endforeach; ?>
    <?php unset($user); ?>

</table>