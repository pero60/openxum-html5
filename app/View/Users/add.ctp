<div class="users form">
<?php echo $this->Form->create('User');?>
    <fieldset>
        <legend><?php echo __('Créer un Compte'); ?></legend>
        <?php echo $this->Form->input('username :');
        echo $this->Form->input('password :');
        echo $this->Form->input('password_verif :');
        echo $this->Form->input('email :');
         echo $this->Form->input('email_verif :');
        echo $this->Form->input('role', array(
            'options' => array('student' => 'Apprenti', 'professor' => 'Tuteur', 'external' => 'Maître d\'apprentissage')
        ));
    ?>
    </fieldset>
<?php echo $this->Form->end(__('Valider'));?>
</div>
