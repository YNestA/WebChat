# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_userprofile_head_img'),
    ]

    operations = [
        migrations.AddField(
            model_name='utumessage',
            name='checked',
            field=models.BooleanField(default=False),
        ),
    ]
