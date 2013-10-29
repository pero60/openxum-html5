<div class="users form">
<?php echo $this->Form->create('User');?>
    <fieldset>
        <legend><?php echo __('Ajouter User'); ?></legend>
        <?php echo $this->Form->input('username');
        echo $this->Form->input('password');
        echo $this->Form->input('role', array(
            'options' => array('admin' => 'Admin', 'student' => 'Apprenti', 'professor' => 'Tuteur', 'external' => 'Maître d\'apprentissage')
        ));
    ?>
    </fieldset>
<?php echo $this->Form->end(__('Ajouter'));?>
</div>