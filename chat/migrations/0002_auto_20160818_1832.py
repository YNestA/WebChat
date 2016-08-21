# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userprofile',
            old_name='sdad_id',
            new_name='person_id',
        ),
        migrations.AddField(
            model_name='chatgroup',
            name='enable',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='utgmessage',
            name='enable',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='utumessage',
            name='enable',
            field=models.BooleanField(default=True),
        ),
    ]
