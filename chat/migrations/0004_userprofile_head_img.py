# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_auto_20160818_1904'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='head_img',
            field=models.CharField(default=b'/static/image/common/user.jpg', max_length=200),
        ),
    ]
