<div class="users form">
<?php echo $this->Session->flash('auth'); ?>
<?php echo $this->Form->create('User');?>
    <fieldset>
        <?php
        echo $this->Form->input('username');
        echo $this->Form->input('password');
        ?>
    </fieldset>
<?php echo $this->Form->end(__('Sign in'));?>
<?php echo $this->Html->link(__('Créer un compte'), array('controller' => 'users', 'action' => 'add')); ?>
</div>