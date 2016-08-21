# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_auto_20160818_1832'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userprofile',
            old_name='person_id',
            new_name='TEL',
        ),
        migrations.AddField(
            model_name='userprofile',
            name='created_time',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='user',
            field=models.OneToOneField(related_name='user_profile', to=settings.AUTH_USER_MODEL),
        ),
    ]
